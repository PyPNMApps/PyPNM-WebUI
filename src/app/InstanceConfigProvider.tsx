import { useEffect, useMemo, useState, type ReactNode } from "react";

import { InstanceConfigContext } from "@/app/InstanceConfigContext";
import { loadInstanceConfig, readStoredInstanceId, storeSelectedInstanceId } from "@/lib/instanceConfig";
import type { PypnmInstance, PypnmInstanceConfig } from "@/types/config";

export interface InstanceConfigContextValue {
  config: PypnmInstanceConfig | null;
  instances: PypnmInstance[];
  selectedInstance: PypnmInstance | null;
  isLoading: boolean;
  error: string | null;
  setSelectedInstanceId: (instanceId: string) => void;
}

interface InstanceConfigProviderProps {
  children: ReactNode;
}

export function InstanceConfigProvider({ children }: InstanceConfigProviderProps) {
  const [config, setConfig] = useState<PypnmInstanceConfig | null>(null);
  const [selectedInstanceId, setSelectedInstanceIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadInstanceConfig()
      .then((loadedConfig) => {
        if (!isMounted) {
          return;
        }

        const enabledInstances = loadedConfig.instances.filter((instance) => instance.enabled);
        const preferredId = readStoredInstanceId() ?? loadedConfig.defaults.selectedInstance;
        const preferredInstance = enabledInstances.find((instance) => instance.id === preferredId) ?? enabledInstances[0] ?? loadedConfig.instances[0] ?? null;

        setConfig(loadedConfig);
        setSelectedInstanceIdState(preferredInstance?.id ?? null);
        setError(null);
      })
      .catch((loadError) => {
        if (!isMounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Failed to load instance configuration.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<InstanceConfigContextValue>(() => {
    const instances = config?.instances.filter((instance) => instance.enabled) ?? [];
    const selectedInstance = instances.find((instance) => instance.id === selectedInstanceId) ?? instances[0] ?? null;

    return {
      config,
      instances,
      selectedInstance,
      isLoading,
      error,
      setSelectedInstanceId: (instanceId: string) => {
        setSelectedInstanceIdState(instanceId);
        storeSelectedInstanceId(instanceId);
      },
    };
  }, [config, error, isLoading, selectedInstanceId]);

  return <InstanceConfigContext.Provider value={value}>{children}</InstanceConfigContext.Provider>;
}

import { useQuery } from "@tanstack/react-query";

import { useInstanceConfig } from "@/app/useInstanceConfig";
import { getHealth } from "@/services/healthService";

export function useHealth() {
  const { config, selectedInstance } = useInstanceConfig();

  return useQuery({
    queryKey: ["health", selectedInstance?.id],
    queryFn: () => getHealth(selectedInstance?.baseUrl ?? "", config?.defaults.healthPath ?? "/health"),
    enabled: Boolean(selectedInstance),
    refetchInterval: selectedInstance?.polling.enabled ? selectedInstance.polling.intervalMs : false,
  });
}

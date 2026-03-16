import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/FieldLabel";
import { requestFieldHints } from "@/features/operations/requestFieldHints";
import { useDeviceConnectFormDefaults } from "@/features/operations/useRequestFormDefaults";
import type { DeviceConnectRequest } from "@/types/api";

interface DeviceConnectFormValues {
  macAddress: string;
  ipAddress: string;
  community: string;
}

interface DeviceConnectRequestFormProps {
  isPending: boolean;
  canRun: boolean;
  submitLabel: string;
  onSubmit: (payload: DeviceConnectRequest) => void;
  errorMessage?: string;
}

export function DeviceConnectRequestForm({
  isPending,
  canRun,
  submitLabel,
  onSubmit,
  errorMessage,
}: DeviceConnectRequestFormProps) {
  const requestDefaults = useDeviceConnectFormDefaults();
  const { register, handleSubmit, reset } = useForm<DeviceConnectFormValues>({
    defaultValues: requestDefaults,
  });

  useEffect(() => {
    reset(requestDefaults);
  }, [requestDefaults, reset]);

  return (
    <form
      className="grid"
      onSubmit={handleSubmit((values) => {
        onSubmit({
          cable_modem: {
            mac_address: values.macAddress,
            ip_address: values.ipAddress,
            snmp: {
              snmpV2C: {
                community: values.community,
              },
            },
          },
        });
      })}
    >
      <div className="grid two request-input-grid">
        <div className="field">
          <FieldLabel htmlFor="deviceConnectMacAddress" hint={requestFieldHints.mac_address}>MAC Address</FieldLabel>
          <input id="deviceConnectMacAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="deviceConnectIpAddress" hint={requestFieldHints.ip_address}>IP Address</FieldLabel>
          <input id="deviceConnectIpAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="deviceConnectCommunity" hint={requestFieldHints.snmp_rw_community}>SNMP RW Community</FieldLabel>
          <input id="deviceConnectCommunity" {...register("community")} placeholder="private" />
        </div>
      </div>
      <div className="actions">
        <button type="submit" className="primary" disabled={isPending || !canRun}>
          {isPending ? "Running..." : submitLabel}
        </button>
      </div>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </form>
  );
}

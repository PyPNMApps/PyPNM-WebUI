import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/FieldLabel";
import { requestFieldHints } from "@/features/operations/requestFieldHints";
import type { DeviceEventLogRequest } from "@/types/api";

interface EventLogFormValues {
  macAddress: string;
  ipAddress: string;
  community: string;
}

interface EventLogRequestFormProps {
  isPending: boolean;
  canRun: boolean;
  submitLabel: string;
  onSubmit: (payload: DeviceEventLogRequest) => void;
  errorMessage?: string;
}

export function EventLogRequestForm({
  isPending,
  canRun,
  submitLabel,
  onSubmit,
  errorMessage,
}: EventLogRequestFormProps) {
  const { register, handleSubmit } = useForm<EventLogFormValues>({
    defaultValues: {
      macAddress: "",
      ipAddress: "",
      community: "private",
    },
  });

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
      <div className="grid two">
        <div className="field">
          <FieldLabel htmlFor="eventLogMacAddress" hint={requestFieldHints.mac_address}>MAC Address</FieldLabel>
          <input id="eventLogMacAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="eventLogIpAddress" hint={requestFieldHints.ip_address}>IP Address</FieldLabel>
          <input id="eventLogIpAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="eventLogCommunity" hint={requestFieldHints.snmp_rw_community}>SNMP RW Community</FieldLabel>
          <input id="eventLogCommunity" {...register("community")} placeholder="private" />
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

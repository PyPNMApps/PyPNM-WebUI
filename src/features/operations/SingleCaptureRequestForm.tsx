import { useForm } from "react-hook-form";

import type { SingleRxMerCaptureRequest } from "@/types/api";

export interface SingleCaptureFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  channelIds: string;
  community: string;
}

interface SingleCaptureRequestFormProps {
  isPending: boolean;
  canRun: boolean;
  submitLabel: string;
  onSubmit: (payload: SingleRxMerCaptureRequest) => void;
  errorMessage?: string;
}

export function SingleCaptureRequestForm({
  isPending,
  canRun,
  submitLabel,
  onSubmit,
  errorMessage,
}: SingleCaptureRequestFormProps) {
  const { register, handleSubmit } = useForm<SingleCaptureFormValues>({
    defaultValues: {
      macAddress: "",
      ipAddress: "",
      tftpIpv4: "",
      tftpIpv6: "",
      channelIds: "194",
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
            pnm_parameters: {
              tftp: {
                ipv4: values.tftpIpv4,
                ipv6: values.tftpIpv6,
              },
              capture: {
                channel_ids: values.channelIds
                  .split(",")
                  .map((value) => Number.parseInt(value.trim(), 10))
                  .filter((value) => Number.isInteger(value)),
              },
            },
            snmp: {
              snmpV2C: {
                community: values.community,
              },
            },
          },
          analysis: {
            type: "basic",
            output: { type: "json" },
            plot: { ui: { theme: "dark" } },
          },
        });
      })}
    >
      <div className="grid two">
        <div className="field">
          <label htmlFor="macAddress">MAC Address</label>
          <input id="macAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <label htmlFor="ipAddress">IP Address</label>
          <input id="ipAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <label htmlFor="tftpIpv4">TFTP IPv4</label>
          <input id="tftpIpv4" {...register("tftpIpv4")} placeholder="192.168.100.2" />
        </div>
        <div className="field">
          <label htmlFor="tftpIpv6">TFTP IPv6</label>
          <input id="tftpIpv6" {...register("tftpIpv6")} placeholder="::1" />
        </div>
        <div className="field">
          <label htmlFor="channelIds">Channel IDs</label>
          <input id="channelIds" {...register("channelIds")} placeholder="194" />
        </div>
        <div className="field">
          <label htmlFor="community">SNMP RW Community</label>
          <input id="community" {...register("community")} placeholder="private" />
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

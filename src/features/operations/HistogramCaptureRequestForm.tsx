import { useForm } from "react-hook-form";

import type { SingleHistogramCaptureRequest } from "@/types/api";

interface HistogramCaptureFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  community: string;
  sampleDuration: number;
}

interface HistogramCaptureRequestFormProps {
  isPending: boolean;
  canRun: boolean;
  submitLabel: string;
  onSubmit: (payload: SingleHistogramCaptureRequest) => void;
  errorMessage?: string;
}

export function HistogramCaptureRequestForm({
  isPending,
  canRun,
  submitLabel,
  onSubmit,
  errorMessage,
}: HistogramCaptureRequestFormProps) {
  const { register, handleSubmit } = useForm<HistogramCaptureFormValues>({
    defaultValues: {
      macAddress: "",
      ipAddress: "",
      tftpIpv4: "",
      tftpIpv6: "",
      community: "private",
      sampleDuration: 10,
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
          capture_settings: {
            sample_duration: values.sampleDuration,
          },
        });
      })}
    >
      <div className="grid two">
        <div className="field">
          <label htmlFor="histMacAddress">MAC Address</label>
          <input id="histMacAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <label htmlFor="histIpAddress">IP Address</label>
          <input id="histIpAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <label htmlFor="histTftpIpv4">TFTP IPv4</label>
          <input id="histTftpIpv4" {...register("tftpIpv4")} placeholder="192.168.100.2" />
        </div>
        <div className="field">
          <label htmlFor="histTftpIpv6">TFTP IPv6</label>
          <input id="histTftpIpv6" {...register("tftpIpv6")} placeholder="::1" />
        </div>
        <div className="field">
          <label htmlFor="histCommunity">SNMP RW Community</label>
          <input id="histCommunity" {...register("community")} placeholder="private" />
        </div>
        <div className="field">
          <label htmlFor="sampleDuration">Sample Duration</label>
          <input id="sampleDuration" type="number" min="1" step="1" {...register("sampleDuration", { valueAsNumber: true })} />
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

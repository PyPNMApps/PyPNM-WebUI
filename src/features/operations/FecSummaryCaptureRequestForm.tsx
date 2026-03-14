import { useForm } from "react-hook-form";

import type { SingleFecSummaryCaptureRequest } from "@/types/api";

interface FecSummaryCaptureFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  channelIds: string;
  community: string;
  fecSummaryType: number;
}

interface FecSummaryCaptureRequestFormProps {
  isPending: boolean;
  canRun: boolean;
  submitLabel: string;
  onSubmit: (payload: SingleFecSummaryCaptureRequest) => void;
  errorMessage?: string;
}

export function FecSummaryCaptureRequestForm({
  isPending,
  canRun,
  submitLabel,
  onSubmit,
  errorMessage,
}: FecSummaryCaptureRequestFormProps) {
  const { register, handleSubmit } = useForm<FecSummaryCaptureFormValues>({
    defaultValues: {
      macAddress: "",
      ipAddress: "",
      tftpIpv4: "",
      tftpIpv6: "",
      channelIds: "0",
      community: "private",
      fecSummaryType: 2,
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
          capture_settings: {
            fec_summary_type: values.fecSummaryType,
          },
        });
      })}
    >
      <div className="grid two">
        <div className="field">
          <label htmlFor="fecMacAddress">MAC Address</label>
          <input id="fecMacAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <label htmlFor="fecIpAddress">IP Address</label>
          <input id="fecIpAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <label htmlFor="fecTftpIpv4">TFTP IPv4</label>
          <input id="fecTftpIpv4" {...register("tftpIpv4")} placeholder="192.168.100.2" />
        </div>
        <div className="field">
          <label htmlFor="fecTftpIpv6">TFTP IPv6</label>
          <input id="fecTftpIpv6" {...register("tftpIpv6")} placeholder="::1" />
        </div>
        <div className="field">
          <label htmlFor="fecChannelIds">Channel IDs</label>
          <input id="fecChannelIds" {...register("channelIds")} placeholder="0" />
        </div>
        <div className="field">
          <label htmlFor="fecCommunity">SNMP RW Community</label>
          <input id="fecCommunity" {...register("community")} placeholder="private" />
        </div>
        <div className="field">
          <label htmlFor="fecSummaryType">FEC Summary Type</label>
          <select id="fecSummaryType" {...register("fecSummaryType", { valueAsNumber: true })}>
            <option value={1}>24Hours</option>
            <option value={2}>10Min</option>
          </select>
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

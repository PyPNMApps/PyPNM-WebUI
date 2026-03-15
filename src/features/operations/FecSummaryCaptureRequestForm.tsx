import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/FieldLabel";
import { requestFieldHints } from "@/features/operations/requestFieldHints";
import { useCommonRequestFormDefaults } from "@/features/operations/useRequestFormDefaults";
import { parseChannelIds } from "@/lib/channelIds";
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
  const requestDefaults = useCommonRequestFormDefaults();
  const { register, handleSubmit, reset } = useForm<FecSummaryCaptureFormValues>({
    defaultValues: {
      ...requestDefaults,
      fecSummaryType: 2,
    },
  });

  useEffect(() => {
    reset({
      ...requestDefaults,
      fecSummaryType: 2,
    });
  }, [requestDefaults, reset]);

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
                channel_ids: parseChannelIds(values.channelIds),
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
          <FieldLabel htmlFor="fecMacAddress" hint={requestFieldHints.mac_address}>MAC Address</FieldLabel>
          <input id="fecMacAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="fecIpAddress" hint={requestFieldHints.ip_address}>IP Address</FieldLabel>
          <input id="fecIpAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="fecTftpIpv4" hint={requestFieldHints.tftp_ipv4}>TFTP IPv4</FieldLabel>
          <input id="fecTftpIpv4" {...register("tftpIpv4")} placeholder="192.168.100.2" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="fecTftpIpv6" hint={requestFieldHints.tftp_ipv6}>TFTP IPv6</FieldLabel>
          <input id="fecTftpIpv6" {...register("tftpIpv6")} placeholder="::1" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="fecChannelIds" hint={requestFieldHints.channel_ids}>
            Channel IDs
          </FieldLabel>
          <input id="fecChannelIds" {...register("channelIds")} placeholder="0" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="fecCommunity" hint={requestFieldHints.snmp_rw_community}>SNMP RW Community</FieldLabel>
          <input id="fecCommunity" {...register("community")} placeholder="private" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="fecSummaryType">FEC Summary Type</FieldLabel>
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

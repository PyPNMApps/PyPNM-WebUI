import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/FieldLabel";
import { requestFieldHints } from "@/features/operations/requestFieldHints";
import { useCommonRequestFormDefaults } from "@/features/operations/useRequestFormDefaults";
import { parseChannelIds } from "@/lib/channelIds";
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
  const requestDefaults = useCommonRequestFormDefaults();
  const { register, handleSubmit, reset } = useForm<SingleCaptureFormValues>({
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
        });
      })}
    >
      <div className="grid two request-input-grid six-up">
        <div className="field">
          <FieldLabel htmlFor="macAddress" hint={requestFieldHints.mac_address}>MAC Address</FieldLabel>
          <input id="macAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="ipAddress" hint={requestFieldHints.ip_address}>IP Address</FieldLabel>
          <input id="ipAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="tftpIpv4" hint={requestFieldHints.tftp_ipv4}>TFTP IPv4</FieldLabel>
          <input id="tftpIpv4" {...register("tftpIpv4")} placeholder="192.168.100.2" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="tftpIpv6" hint={requestFieldHints.tftp_ipv6}>TFTP IPv6</FieldLabel>
          <input id="tftpIpv6" {...register("tftpIpv6")} placeholder="::1" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="channelIds" hint={requestFieldHints.channel_ids}>
            Channel IDs
          </FieldLabel>
          <input id="channelIds" {...register("channelIds")} placeholder="0" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="community" hint={requestFieldHints.snmp_rw_community}>SNMP RW Community</FieldLabel>
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

import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/FieldLabel";
import { requestFieldHints } from "@/features/operations/requestFieldHints";
import { parseChannelIds } from "@/lib/channelIds";
import type { SingleConstellationDisplayCaptureRequest } from "@/types/api";

interface ConstellationDisplayFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  channelIds: string;
  community: string;
  displayCrossHair: boolean;
  modulationOrderOffset: number;
  numberSampleSymbol: number;
}

interface ConstellationDisplayCaptureRequestFormProps {
  isPending: boolean;
  canRun: boolean;
  submitLabel: string;
  onSubmit: (payload: SingleConstellationDisplayCaptureRequest) => void;
  errorMessage?: string;
}

export function ConstellationDisplayCaptureRequestForm({
  isPending,
  canRun,
  submitLabel,
  onSubmit,
  errorMessage,
}: ConstellationDisplayCaptureRequestFormProps) {
  const { register, handleSubmit } = useForm<ConstellationDisplayFormValues>({
    defaultValues: {
      macAddress: "",
      ipAddress: "",
      tftpIpv4: "",
      tftpIpv6: "",
      channelIds: "0",
      community: "private",
      displayCrossHair: true,
      modulationOrderOffset: 0,
      numberSampleSymbol: 8192,
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
            plot: {
              ui: { theme: "dark" },
              options: {
                display_cross_hair: values.displayCrossHair,
              },
            },
          },
          capture_settings: {
            modulation_order_offset: values.modulationOrderOffset,
            number_sample_symbol: values.numberSampleSymbol,
          },
        });
      })}
    >
      <div className="grid two">
        <div className="field">
          <FieldLabel htmlFor="constMacAddress">MAC Address</FieldLabel>
          <input id="constMacAddress" {...register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="constIpAddress">IP Address</FieldLabel>
          <input id="constIpAddress" {...register("ipAddress")} placeholder="192.168.100.10" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="constTftpIpv4">TFTP IPv4</FieldLabel>
          <input id="constTftpIpv4" {...register("tftpIpv4")} placeholder="192.168.100.2" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="constTftpIpv6">TFTP IPv6</FieldLabel>
          <input id="constTftpIpv6" {...register("tftpIpv6")} placeholder="::1" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="constChannelIds" hint={requestFieldHints.channel_ids}>
            Channel IDs
          </FieldLabel>
          <input id="constChannelIds" {...register("channelIds")} placeholder="0" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="constCommunity">SNMP RW Community</FieldLabel>
          <input id="constCommunity" {...register("community")} placeholder="private" />
        </div>
        <div className="field">
          <FieldLabel htmlFor="displayCrossHair">Display Cross Hair</FieldLabel>
          <select id="displayCrossHair" {...register("displayCrossHair", { setValueAs: (value) => value === "true" })}>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div className="field">
          <FieldLabel htmlFor="modulationOrderOffset">Modulation Order Offset</FieldLabel>
          <input id="modulationOrderOffset" type="number" step="1" {...register("modulationOrderOffset", { valueAsNumber: true })} />
        </div>
        <div className="field">
          <FieldLabel htmlFor="numberSampleSymbol">Number Sample Symbol</FieldLabel>
          <input id="numberSampleSymbol" type="number" min="1" step="1" {...register("numberSampleSymbol", { valueAsNumber: true })} />
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

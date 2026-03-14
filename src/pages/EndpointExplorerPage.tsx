import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { useInstanceConfig } from "@/app/useInstanceConfig";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { SingleRxMerCaptureView } from "@/features/operations/SingleRxMerCaptureView";
import { singleRxMerFixture } from "@/features/operations/singleRxMerFixture";
import { runSingleRxMerCapture } from "@/services/singleRxMerService";
import type { SingleRxMerCaptureRequest } from "@/types/api";

interface SingleRxMerFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  channelIds: string;
  community: string;
}

export function EndpointExplorerPage() {
  const { selectedInstance } = useInstanceConfig();
  const [response, setResponse] = useState(singleRxMerFixture);
  const { register, handleSubmit } = useForm<SingleRxMerFormValues>({
    defaultValues: {
      macAddress: "",
      ipAddress: "",
      tftpIpv4: "",
      tftpIpv6: "",
      channelIds: "194",
      community: "private",
    },
  });
  const mutation = useMutation({
    mutationFn: (payload: SingleRxMerCaptureRequest) => runSingleRxMerCapture(selectedInstance?.baseUrl ?? "", payload),
    onSuccess: (data) => {
      setResponse(data);
    },
  });

  return (
    <>
      <PageHeader title="RxMER" subtitle="" />
      <Panel title="Capture Inputs">
        <form
          className="grid"
          onSubmit={handleSubmit((values) => {
            const payload: SingleRxMerCaptureRequest = {
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
            };

            mutation.mutate(payload);
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
            <button type="submit" className="primary" disabled={mutation.isPending || !selectedInstance}>
              {mutation.isPending ? "Running..." : "Run getCapture"}
            </button>
          </div>
          {mutation.isError ? <p>{(mutation.error as Error).message}</p> : null}
        </form>
      </Panel>

      <Panel title="">
        <SingleRxMerCaptureView response={response} />
      </Panel>
    </>
  );
}

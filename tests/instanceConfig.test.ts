import { describe, expect, it } from "vitest";

import { mergeRawConfig } from "@/lib/instanceConfig";

describe("instanceConfig", () => {
  it("merges local overrides onto the versioned template instead of falling back", () => {
    const merged = mergeRawConfig(
      {
        version: 1,
        defaults: {
          selected_instance: "lab-local",
          poll_interval_ms: 5000,
          request_timeout_ms: 30000,
          health_path: "/health",
        },
        instances: [
          {
            id: "lab-local",
            label: "Lab Local",
            base_url: "http://127.0.0.1:8080",
            enabled: true,
            request_defaults: {
              cable_modem: {
                mac_address: "aa:bb:cc:dd:ee:ff",
                ip_address: "192.168.0.10",
              },
              snmp: {
                rw_community: "private",
              },
            },
          },
        ],
      },
      {
        defaults: {
          selected_instance: "lab-local",
        },
        instances: [
          {
            id: "lab-local",
            request_defaults: {
              cable_modem: {
                ip_address: "192.168.0.20",
              },
            },
          },
        ],
      },
    );

    expect(merged.instances?.[0]?.label).toBe("Lab Local");
    expect(merged.instances?.[0]?.base_url).toBe("http://127.0.0.1:8080");
    expect(merged.instances?.[0]?.request_defaults?.cable_modem?.mac_address).toBe("aa:bb:cc:dd:ee:ff");
    expect(merged.instances?.[0]?.request_defaults?.cable_modem?.ip_address).toBe("192.168.0.20");
    expect(merged.defaults?.selected_instance).toBe("lab-local");
  });
});

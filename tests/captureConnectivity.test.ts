import { describe, expect, it } from "vitest";

import {
  hasCompleteCaptureConnectivityInputs,
  isCaptureConnectivityOnline,
  normalizeCaptureConnectivityInputs,
} from "@/features/operations/captureConnectivity";

describe("captureConnectivity", () => {
  it("normalizes capture connectivity inputs", () => {
    expect(
      normalizeCaptureConnectivityInputs({
        macAddress: " aa:bb:cc:dd:ee:ff ",
        ipAddress: " 192.168.100.10 ",
        community: " private ",
      }),
    ).toEqual({
      macAddress: "aa:bb:cc:dd:ee:ff",
      ipAddress: "192.168.100.10",
      community: "private",
    });
  });

  it("detects when capture connectivity inputs are complete", () => {
    expect(
      hasCompleteCaptureConnectivityInputs({
        macAddress: "aa:bb:cc:dd:ee:ff",
        ipAddress: "192.168.100.10",
        community: "private",
      }),
    ).toBe(true);
    expect(
      hasCompleteCaptureConnectivityInputs({
        macAddress: "aa:bb:cc:dd:ee:ff",
        ipAddress: "",
        community: "private",
      }),
    ).toBe(false);
  });

  it("only allows execution when the modem is online", () => {
    expect(isCaptureConnectivityOnline("online")).toBe(true);
    expect(isCaptureConnectivityOnline("unknown")).toBe(false);
    expect(isCaptureConnectivityOnline("checking")).toBe(false);
    expect(isCaptureConnectivityOnline("offline")).toBe(false);
  });
});

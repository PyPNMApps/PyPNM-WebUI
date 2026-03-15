import { describe, expect, it } from "vitest";

import { classifyHealthError } from "../src/services/healthService";

describe("classifyHealthError", () => {
  it("marks timeout and network failures as unreachable", () => {
    expect(classifyHealthError(new Error("timeout of 4000ms exceeded"))).toEqual({
      status: "unreachable",
      message: "timeout of 4000ms exceeded",
    });
    expect(classifyHealthError(new Error("Network Error"))).toEqual({
      status: "unreachable",
      message: "Network Error",
    });
  });

  it("keeps non-network failures as error", () => {
    expect(classifyHealthError(new Error("503 upstream failure"))).toEqual({
      status: "error",
      message: "503 upstream failure",
    });
  });
});

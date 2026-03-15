#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

import yaml

INPUT_PATH = Path("public/config/pypnm-instances.yaml")
OUTPUT_DIR = Path("release-reports/runtime-config")
OUTPUT_PATH = OUTPUT_DIR / "pypnm-instances.sanitized.yaml"


def _example_agent_url(index: int) -> str:
    if index == 0:
        return "http://127.0.0.1:8080"
    return f"http://192.0.2.{10 + index}:8080"


def _example_mac(index: int) -> str:
    return f"aa:bb:cc:dd:ee:{index + 1:02x}"


def _example_cm_ip(index: int) -> str:
    return f"192.168.100.{10 + index}"


def _example_tftp_ip(index: int) -> str:
    return f"192.168.100.{2 + index}"


def sanitize_runtime_config(raw: dict[str, Any]) -> dict[str, Any]:
    sanitized = {
        "version": int(raw.get("version", 1) or 1),
        "defaults": {
            "selected_instance": str(raw.get("defaults", {}).get("selected_instance", "default") or "default"),
            "poll_interval_ms": int(raw.get("defaults", {}).get("poll_interval_ms", 5000) or 5000),
            "request_timeout_ms": int(raw.get("defaults", {}).get("request_timeout_ms", 30000) or 30000),
            "health_path": str(raw.get("defaults", {}).get("health_path", "/health") or "/health"),
        },
        "instances": [],
    }

    instances = raw.get("instances", [])
    if not isinstance(instances, list):
        return sanitized

    for index, instance in enumerate(instances):
        if not isinstance(instance, dict):
            continue

        sanitized["instances"].append(
            {
                "id": str(instance.get("id", f"agent-{index + 1}") or f"agent-{index + 1}"),
                "label": str(instance.get("label", f"PyPNM Agent {index + 1}") or f"PyPNM Agent {index + 1}"),
                "base_url": _example_agent_url(index),
                "enabled": bool(instance.get("enabled", True)),
                "tags": list(instance.get("tags", [])) if isinstance(instance.get("tags", []), list) else [],
                "capabilities": list(instance.get("capabilities", []))
                if isinstance(instance.get("capabilities", []), list)
                else [],
                "polling": {
                    "enabled": bool(instance.get("polling", {}).get("enabled", True)),
                    "interval_ms": int(instance.get("polling", {}).get("interval_ms", sanitized["defaults"]["poll_interval_ms"])),
                },
                "request_defaults": {
                    "cable_modem": {
                        "mac_address": _example_mac(index),
                        "ip_address": _example_cm_ip(index),
                    },
                    "tftp": {
                        "ipv4": _example_tftp_ip(index),
                        "ipv6": "::1",
                    },
                    "capture": {
                        "channel_ids": [],
                    },
                    "snmp": {
                        "rw_community": "private",
                    },
                },
            }
        )

    if sanitized["instances"] and not any(
        instance["id"] == sanitized["defaults"]["selected_instance"] for instance in sanitized["instances"]
    ):
        sanitized["defaults"]["selected_instance"] = sanitized["instances"][0]["id"]

    return sanitized


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a sanitized release copy of public/config/pypnm-instances.yaml without modifying the live file."
    )
    parser.add_argument("--input", default=str(INPUT_PATH), help=f"Input runtime config (default: {INPUT_PATH})")
    parser.add_argument("--output", default=str(OUTPUT_PATH), help=f"Sanitized output path (default: {OUTPUT_PATH})")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.is_file():
        print(f"ERROR: missing runtime config: {input_path}")
        return 1

    with input_path.open("r", encoding="utf-8") as handle:
        raw = yaml.safe_load(handle) or {}

    if not isinstance(raw, dict):
        print(f"ERROR: runtime config must be a YAML mapping: {input_path}")
        return 2

    sanitized = sanitize_runtime_config(raw)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        yaml.safe_dump(sanitized, handle, sort_keys=False)

    print(f"Sanitized runtime config written to: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
from __future__ import annotations

import unittest

from tools.release.sanitize_runtime_config import sanitize_runtime_config


class SanitizeRuntimeConfigTests(unittest.TestCase):
    def test_sanitize_runtime_config_keeps_structure_and_replaces_sensitive_values(self) -> None:
        sanitized = sanitize_runtime_config(
            {
                "version": 1,
                "defaults": {
                    "selected_instance": "rack-2",
                    "poll_interval_ms": 4000,
                    "request_timeout_ms": 45000,
                    "health_path": "/health",
                },
                "instances": [
                    {
                        "id": "rack-1",
                        "label": "Rack 1",
                        "base_url": "http://10.0.0.5:8080",
                        "enabled": True,
                        "tags": ["lab"],
                        "capabilities": ["health", "analysis"],
                        "polling": {"enabled": True, "interval_ms": 4000},
                        "request_defaults": {
                            "cable_modem": {"mac_address": "de:ad:be:ef:00:01", "ip_address": "10.0.0.20"},
                            "tftp": {"ipv4": "10.0.0.2", "ipv6": "2001:db8::1"},
                            "capture": {"channel_ids": [193]},
                            "snmp": {"rw_community": "super-secret"},
                        },
                    },
                    {
                        "id": "rack-2",
                        "label": "Rack 2",
                        "base_url": "http://10.0.0.6:8080",
                    },
                ],
            }
        )

        self.assertEqual(sanitized["defaults"]["selected_instance"], "rack-2")
        self.assertEqual(sanitized["instances"][0]["base_url"], "http://127.0.0.1:8080")
        self.assertEqual(sanitized["instances"][1]["base_url"], "http://192.0.2.11:8080")
        self.assertEqual(sanitized["instances"][0]["request_defaults"]["cable_modem"]["mac_address"], "aa:bb:cc:dd:ee:01")
        self.assertEqual(sanitized["instances"][0]["request_defaults"]["cable_modem"]["ip_address"], "192.168.100.10")
        self.assertEqual(sanitized["instances"][0]["request_defaults"]["snmp"]["rw_community"], "private")
        self.assertEqual(sanitized["instances"][0]["request_defaults"]["capture"]["channel_ids"], [])


if __name__ == "__main__":
    unittest.main()

export const requestFieldHints = {
  mac_address: "Cable modem MAC address.",
  ip_address: "Reachable IPv4 address of the cable modem.",
  tftp_ipv4: "IPv4 address of the TFTP server used for capture retrieval.",
  tftp_ipv6: "IPv6 address of the TFTP server used for capture retrieval.",
  channel_ids: "0 means all channels.",
  snmp_rw_community: "SNMP read-write community string used for the request.",
} as const;

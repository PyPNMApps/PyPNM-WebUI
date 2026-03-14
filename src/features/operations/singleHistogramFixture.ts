import type { SingleHistogramCaptureResponse } from "@/types/api";

export const singleHistogramFixture: SingleHistogramCaptureResponse = {
  system_description: {
    HW_REV: "1.0",
    VENDOR: "LANCity",
    BOOTR: "NONE",
    SW_REV: "1.0.0",
    MODEL: "LCPET-3",
  },
  mac_address: "aa:bb:cc:dd:ee:ff",
  status: 0,
  message: null,
  data: {
    analysis: [
      {
        mac_address: "aa:bb:cc:dd:ee:ff",
        pnm_header: {
          capture_time: "1772952501",
        },
        device_details: {
          system_description: {
            HW_REV: "1.0",
            VENDOR: "LANCity",
            BOOTR: "NONE",
            SW_REV: "1.0.0",
            MODEL: "LCPET-3",
          },
        },
        hit_counts: [0, 3, 6, 11, 19, 26, 31, 28, 24, 18, 13, 7, 4, 2, 1, 0],
      },
    ],
  },
};

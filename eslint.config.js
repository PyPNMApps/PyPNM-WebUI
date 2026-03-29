import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".venv", "release-reports"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/pages/*"],
              message: "Import PW pages from '@/pw/pages/*'.",
            },
            {
              group: ["@/features/*"],
              message: "Import PW features from '@/pw/features/*'.",
            },
            {
              group: ["@/services/advanced/*"],
              message: "Import advanced services from '@/pw/services/advanced/*'.",
            },
            {
              group: [
                "@/services/captureConnectivityService",
                "@/services/endpointsService",
                "@/services/pnmFilesService",
                "@/services/singleCaptureService",
                "@/services/singleRxMerService",
                "@/services/advancedRxMerService",
              ],
              message: "Import PW services from '@/pw/services/*'.",
            },
          ],
        },
      ],
    },
  },
);

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    // Design handoff bundle: reference/example files, not shipped app code.
    "design_handoff_arf_enterprise_refresh/**",
    // design-sync machine state: staged converter scripts, generated bundle
    // output (including vendored React itself under ds-bundle/_vendor/),
    // and the verification cache -- none of it is source this repo owns.
    "packages/*/.ds-sync/**",
    "packages/*/ds-bundle/**",
    "packages/*/.design-sync/.cache/**",
  ]),
  // Allow require in .cjs files (e.g., jest.config.cjs)
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;

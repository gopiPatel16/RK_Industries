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
    "next-env.d.ts",
    // macOS AppleDouble sidecars — this project lives on an exFAT drive, which
    // can't store extended attributes, so the OS writes a "._name" companion
    // next to every file. They are binary metadata, not source.
    "**/._*",
  ]),
]);

export default eslintConfig;

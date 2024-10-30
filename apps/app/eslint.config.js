import baseConfig, { restrictEnvAccess } from "@gameofblocks/eslint-config/base";
import nextjsConfig from "@gameofblocks/eslint-config/nextjs";
import reactConfig from "@gameofblocks/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];

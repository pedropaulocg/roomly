import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

    ignores: ["node_modules/**", "dist/**", "build/**", "src/generated/**"],

    plugins: {
      js,
    },

    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
]);

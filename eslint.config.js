// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import json from "eslint-plugin-json";

export default [
  {
    files: ["src/**/*.{js,ts,md}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    ...js.configs.recommended,
    ...prettierRecommended,
    rules: {
      "comma-dangle": [
        "error",
        {
          "arrays": "always-multiline",
          "objects": "always-multiline",
          "imports": "always-multiline",
          "exports": "always-multiline",
          "functions": "never"
        }
      ],
    },
  },
  {
    files: ["src/**/*.json"],
    plugins: {
      json: json,
    },
    rules: {
      ...json.configs.recommended.rules,
    },
  },
];
// .eslintrc.js

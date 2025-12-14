import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["eslint.config.mjs"],
  },

  // Config umum (Recommended)
  js.configs.recommended,

  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // Project lo CommonJS
      globals: {
        ...globals.node, // Wajib buat backend
      },
    },
    rules: {
      // Kita bilang: "Kalau variabel depannya underscore (_), tolong diikhlaskan"
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off", // Backend butuh console.log
    },
  },

  // Config khusus Testing (Jest)
  {
    files: ["**/*.test.js", "**/tests/**/*.js", "**/*.test.js"], // Gue tambahin pola dikit
    languageOptions: {
      globals: {
        ...globals.jest, // Biar kenal describe, it, expect
      },
    },
  },
];

// eslint.config.mjs (Note a extensão .mjs)
import tseslint from "typescript-eslint";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["node_modules/", "dist/", "build/", "**/*.js"],
  },

  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "no-console": "warn",
      // Regras específicas do Prettier via plugin
      "prettier/prettier": "error",
      // Exemplo de regra TS que você tinha
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  prettierConfig,
);

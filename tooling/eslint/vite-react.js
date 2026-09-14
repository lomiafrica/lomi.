import { createRequire } from "node:module";

const requireFromApp = createRequire(`${process.cwd()}/package.json`);

function loadAppModule(specifier) {
  return requireFromApp(specifier);
}

export function viteReactEslintConfig({
  extraRules = {},
  extraIgnores = [],
} = {}) {
  const js = loadAppModule("@eslint/js");
  const tsParser = loadAppModule("@typescript-eslint/parser");
  const tsPlugin = loadAppModule("@typescript-eslint/eslint-plugin");
  const reactPlugin = loadAppModule("eslint-plugin-react");
  const reactHooksPlugin = loadAppModule("eslint-plugin-react-hooks");
  const reactRefreshPlugin = loadAppModule("eslint-plugin-react-refresh");
  const prettierConfig = loadAppModule("eslint-config-prettier");
  const globals = loadAppModule("globals");

  return [
    {
      ignores: [
        "**/dist/**",
        "**/node_modules/**",
        "**/.eslintrc.cjs",
        "**/eslint.config.js",
        ...extraIgnores,
      ],
    },
    js.configs.recommended,
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
          ecmaFeatures: {
            jsx: true,
          },
        },
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      plugins: {
        "@typescript-eslint": tsPlugin,
        react: reactPlugin,
        "react-hooks": reactHooksPlugin,
        "react-refresh": reactRefreshPlugin,
      },
      rules: {
        ...tsPlugin.configs.recommended.rules,
        ...reactPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        "react-refresh/only-export-components": "off",
        "no-eval": "error",
        "no-new-func": "error",
        "no-implied-eval": "error",
        "no-undef": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/indent": "off",
        ...extraRules,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    prettierConfig,
  ];
}

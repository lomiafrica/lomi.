import { createRequire } from "node:module";

const requireFromApp = createRequire(`${process.cwd()}/package.json`);

function loadAppModule(specifier) {
  return requireFromApp(specifier);
}

export function nextEslintConfig({ extraIgnores = [] } = {}) {
  const nextVitals = loadAppModule("eslint-config-next/core-web-vitals");
  const nextTs = loadAppModule("eslint-config-next/typescript");
  const prettierConfig = loadAppModule("eslint-config-prettier");
  return [
    ...(nextVitals.default ?? nextVitals),
    ...(nextTs.default ?? nextTs),
    prettierConfig.default ?? prettierConfig,
    {
      ignores: [
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        ...extraIgnores,
      ],
    },
    {
      rules: {
        // Established patterns (latest-callback refs, mount fetches) until
        // components are migrated for React Compiler purity constraints.
        "react-hooks/refs": "off",
        "react-hooks/set-state-in-effect": "off",
      },
    },
  ];
}

module.exports = {
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    jsxPragma: "h",
    project: true,
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: ["./**/*.{js,cjs,mjs}"],
    },
  ],
  root: true,
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      pragma: "h",
    },
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    "sort-imports": "off",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          orderImportKind: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
        warnOnUnassignedImports: true,
        pathGroups: [
          {
            pattern: "preact",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "preact/*",
            group: "builtin",
            position: "before",
          },
        ],
        distinctGroup: false,
        pathGroupsExcludedImportTypes: ["preact", "preact/*"],
      },
    ],
  },
};

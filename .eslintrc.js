module.exports = {
  plugins: ["@typescript-eslint", "import", "react", "react-hooks"],
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
      version: "16.0",
    },
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    "no-console": [
      "warn",
      {
        allow: ["error"],
      },
    ],
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
    "react/no-deprecated": 2,
    "react/react-in-jsx-scope": 0, // handled this automatically
    "react/display-name": [1, { ignoreTranspilerName: false }],
    "react/jsx-no-bind": [
      1,
      {
        ignoreRefs: true,
        allowFunctions: true,
        allowArrowFunctions: true,
      },
    ],
    "react/jsx-no-comment-textnodes": 2,
    "react/jsx-no-duplicate-props": 2,
    "react/jsx-no-target-blank": 2,
    "react/jsx-no-undef": 2,
    "react/jsx-tag-spacing": [2, { beforeSelfClosing: "always" }],
    "react/jsx-uses-react": 2, // debatable
    "react/jsx-uses-vars": 2,
    "react/jsx-key": [2, { checkFragmentShorthand: true }],
    "react/self-closing-comp": 2,
    "react/prefer-es6-class": 2,
    "react/prefer-stateless-function": 1,
    "react/require-render-return": 2,
    "react/no-danger": 1,
    // Legacy APIs not supported in Preact
    "react/no-did-mount-set-state": 2,
    "react/no-did-update-set-state": 2,
    "react/no-find-dom-node": 2,
    "react/no-is-mounted": 2,
    "react/no-string-refs": 2,
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 1,
  },
};

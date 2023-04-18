module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "prettier", "plugin:json/recommended"],
  rules: {
    "prettier/prettier": [
      2,
      {
        printWidth: 99,
        parser: "flow",
      },
    ],
    "no-console": [2, { allow: ["warn", "error"] }],
    "no-shadow": [2, { builtinGlobals: true, hoist: "all" }],
    "no-undef": 2,
    "no-unused-vars": [2, { vars: "all", args: "after-used", ignoreRestSiblings: false }],
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["prettier", "@typescript-eslint", "import"],
      rules: {
        "prettier/prettier": [
          2,
          {
            printWidth: 99,
            parser: "typescript",
          },
        ],
        "import/no-relative-packages": [2],
        "@typescript-eslint/no-unused-vars": [2],
        "import/order": [
          "error",
          {
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
            pathGroups: [],
            "newlines-between": "always",
            alphabetize: {
              order: "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
              caseInsensitive: true /* ignore case. Options: [true, false] */,
            },
          },
        ],
      },
      extends: [
        "eslint:recommended",
        "prettier",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
      settings: {
        "import/resolver": {
          typescript: true,
          node: true,
        },
      },
    },
  ],
};

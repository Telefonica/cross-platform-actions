const path = require("path");

function componentPath() {
  return path.resolve.apply(null, [__dirname, ...arguments]);
}

module.exports = {
  ignorePatterns: ["node_modules", "dist/**/*", "coverage/**/*"],
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
        "no-shadow": [2, { builtinGlobals: true, hoist: "all" }],
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
    {
      files: ["test/**/*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["prettier", "@typescript-eslint", "import", "jest"],
      extends: [
        "eslint:recommended",
        "prettier",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:jest/recommended",
      ],
      rules: {
        "@typescript-eslint/ban-ts-comment": [0],
        "import/order": [
          2,
          {
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
            pathGroups: [
              {
                pattern: "@support/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@src/**",
                group: "internal",
                position: "after",
              },
            ],
            "newlines-between": "always",
            alphabetize: {
              order: "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
              caseInsensitive: true /* ignore case. Options: [true, false] */,
            },
          },
        ],
      },
      settings: {
        "import/resolver": {
          typescript: true,
          node: true,
          alias: {
            map: [
              ["@src", componentPath("src")],
              ["@support", componentPath("test", "unit", "support")],
            ],
            extensions: [".ts", ".js", ".jsx", ".json"],
          },
        },
      },
    },
  ],
};

module.exports = {
  extends: ["./node_modules/gts/", "prettier", "prettier/react"],
  plugins: ["prettier", "eslint-plugin-react", "typescript-sort-keys", "tailwindcss"],
  env: {
    browser: true,
  },
  ignorePatterns: ["public/**/*", "models", "amplify/**/*", "*.md", "*.mdx"],
  rules: {
    "prettier/prettier": "error",
    quotes: [2, "double", { avoidEscape: true, allowTemplateLiterals: true }],
    "object-curly-spacing": [2, "always", { objectsInObjects: true, arraysInObjects: true }],
    "no-empty-pattern": 0,
    "node/no-unpublished-import": 0,
    "node/no-extraneous-import": 0,
    "max-len": [2, { code: 125, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["off", { varsIgnorePattern: "^_", argsIgnorePattern: "(^_|^e$)" }],
    "@typescript-eslint/ban-ts-comment": 0,
    "react/jsx-curly-brace-presence": [
      "error",
      {
        props: "never",
        children: "never",
      },
    ],
    "@typescript-eslint/no-explicit-any": 0,
    "typescript-sort-keys/interface": ["error", "asc", { caseSensitive: true, natural: true, requiredFirst: true }],
    "typescript-sort-keys/string-enum": ["error", "asc", { caseSensitive: true }],
    "react/jsx-sort-props": [
      "error",
      {
        reservedFirst: ["key", "ref"],
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
      },
    ],
    "prefer-template": 1,
    "tailwindcss/classnames-order": 2,
    "tailwindcss/no-custom-classname": 0,
    "tailwindcss/no-contradicting-classname": 0,
  },
  overrides: [
    {
      files: ["aws-exports.js"],
      extends: "./node_modules/gts/",
      parserOptions: {
        sourceType: "module",
      },
      rules: {
        "node/no-unpublished-import": 0,
      },
    },
  ],
};

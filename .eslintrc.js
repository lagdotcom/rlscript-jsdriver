module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "sort-imports-requires"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  rules: {
    "linebreak-style": ["warn", "windows"],
    "prettier/prettier": ["warn", { endOfLine: "crlf" }],
    "sort-imports-requires/sort-imports": "warn",
    "sort-imports-requires/sort-requires": "warn",
  },
};

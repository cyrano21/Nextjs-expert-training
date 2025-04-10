module.exports = {
  rules: {
    "@typescript-eslint/no-require-imports": "off",
  },
  overrides: [
    {
      files: ["middleware.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
};

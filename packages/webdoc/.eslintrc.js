const { NODE_ENV } = process.env

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": NODE_ENV === "production" ? "error" : "off",
    "no-debugger": NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": NODE_ENV === "production" ? 1 : 0,
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        mocha: true
      }
    }
  ]
};

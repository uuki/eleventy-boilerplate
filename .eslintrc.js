module.exports = {
  extends: [],
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [],
  rules: {}
}

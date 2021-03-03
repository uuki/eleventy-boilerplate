module.exports = {
  extends: [],
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [],
  rules: {}
}

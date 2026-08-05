module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended', 'prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2021,
    requireConfigFile: false,
    sourceType: 'module',
  },
  settings: {
    vue: {
      version: '2.7',
    },
  },
  rules: {
    'vue/attributes-order': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
    'vue/no-v-html': 'error',
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: {
        jest: true,
      },
    },
  ],
};

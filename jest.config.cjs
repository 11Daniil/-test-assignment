module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/utils/**/*.js', 'src/components/**/*.{js,vue}'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'vue'],
  roots: ['<rootDir>/tests'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest',
  },
};

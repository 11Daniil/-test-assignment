module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/domain/**/*.js',
    'src/repositories/**/*.js',
    'src/components/**/*.{js,vue}',
    '!src/components/SiteFooter.vue',
  ],
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

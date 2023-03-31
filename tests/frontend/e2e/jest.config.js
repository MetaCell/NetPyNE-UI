module.exports = {
  verbose: true,
  preset: "jest-puppeteer",
  testRegex : "(tests/Test.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  setupFilesAfterEnv: ['./tests/frontend/tests/setupTests.js'],
};
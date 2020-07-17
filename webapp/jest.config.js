module.exports = {
  "preset": "jest-puppeteer",
  "testRegex": "(tests/.*/Test.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  "testPathIgnorePatterns": [
    "<rootDir>/node_modules/"
  ]
};
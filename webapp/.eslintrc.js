module.exports = {
  extends: [
    'airbnb',
  ],
  parser: 'babel-eslint',
  rules: {
    // Turn off some rules so that we can improve the code step by step
    'class-methods-use-this': 0,
    'react/jsx-filename-extension': 0,

    // Tweak some rules to our preferences
    'space-before-function-paren': ['error', 'always'],
    'no-console': 0,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    acnet2: true,
    c302: true,
    pvdr: true,
    net1: true,
    CanvasContainer: true,
    patchRequire: true,
    window: true,
    GEPPETTO: true,
  },
};

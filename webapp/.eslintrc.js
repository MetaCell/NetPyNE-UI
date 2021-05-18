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
    'react/prop-types': 1,
    'no-console': 0,
    'import/extensions': 0,
    'max-len': ['error', { code: 140 }],
    'no-eval': 1,
    eqeqeq: 1,
    'no-plusplus': 1,
    'react/destructuring-assignment': 1,
    'no-param-reassign': 1,
    'vars-on-top': 1,
    'no-use-before-define': 1,
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
    document: true,
    $: true,
    IPython: true,
    fetch: true,
  },
};

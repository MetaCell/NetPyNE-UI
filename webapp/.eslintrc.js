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
    'max-len': ['warn', { code: 140 }],
    'no-eval': 1,
    eqeqeq: 1,
    'no-plusplus': 1,
    'react/destructuring-assignment': 1,
    'no-param-reassign': 1,
    'vars-on-top': 1,
    'no-use-before-define': 1,
    'no-unused-vars': 1,
    'import/no-unresolved': 1,
    'import/named': 1,
    'react/jsx-props-no-spreading': 1,
    'no-nested-ternary': 1,
    'no-return-assign': 1,
    'react/no-array-index-key': 1,
    'react/sort-comp': 1,
    'consistent-return': 1,
    'import/prefer-default-export': 1,
    'react/no-unused-state': 1,
    'jsx-a11y/alt-text': 1,
    'no-restricted-syntax': 1,
    'no-underscore-dangle': 1,
    'no-restricted-globals': 1,
    camelcase: 1,
    'max-classes-per-file': 1,
    'jsx-a11y/click-events-have-key-events': 1,
    'jsx-a11y/no-static-element-interactions': 1,
    'prefer-destructuring': 1,
    'no-redeclare': 1,
    'import/no-webpack-loader-syntax': 1,
    'global-require': 1,
    'default-case': 1,
    'react/prefer-stateless-function': 1,
    'block-scoped-var': 1,
    'no-var': 1,
    'no-shadow': 1,
    'react/no-did-update-set-state': 1,
    'react/no-string-refs': 1,
    'no-multi-assign': 1,
    'guard-for-in': 1,
    'no-unused-expressions': 1,
    'no-control-regex': 1,
    'no-loop-func': 1,
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
    document: true,
    $: true,
    IPython: true,
    fetch: true,
    Blob: true,
    FormData: true,
    Event: true,
    jQuery: true,
    define: true,
    // geppetto
    Instances: true,
    GEPPETTO: true,
  },
};

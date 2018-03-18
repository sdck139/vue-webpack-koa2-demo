module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'html'
  ],
  rules: {
    eqeqeq: 0,
    'no-undef': 0,
    'no-new': 0,
    'space-before-function-paren': [2, 'never'],
    'generator-star-spacing': ["error", {"before": true, "after": false}]
  }
};

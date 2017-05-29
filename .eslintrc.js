module.exports = {
    extends: [
      "djo-base"
    ],
    plugins: [
        "mocha"
    ],
    env: {
      mocha: true
    },
    rules: {
      "no-shadow": [0],
      "consistent-return": [0],
      "no-param-reassign": [0],
      "global-require": [1],
      "import/no-dynamic-require": [1]
    }
};

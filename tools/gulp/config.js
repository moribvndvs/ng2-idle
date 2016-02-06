const path = require('path');

// package.json as JS object
module.exports.pkg = require(path.join(__dirname, '../../package.json'));

module.exports.PATHS = {
  root: path.join(__dirname, '../../'),
  releaseAssets: ['package.json', 'LICENSE', 'README.md', 'CHANGELOG.md'],
  src: {
    base: 'src',
    ts: ['src/**/*.ts', '!src/**/*.spec.ts'],
    tsAll: 'src/**/*.ts',
    js: ['./gulpfile.js', './tools/gulp/*.js']
  },
  dev: 'dev',
  dist: {
    base: 'dist',
    ts: 'dist/ts',
    cjs: 'dist',
    es6: 'dist/es6',
    bundles: 'dist/bundles'
  }
};

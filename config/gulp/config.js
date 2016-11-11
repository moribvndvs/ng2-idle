const path = require('path');

// package.json as JS object
module.exports.pkg = require(path.join(__dirname, '../../package.json'));

module.exports.PATHS = {
  root: path.join(__dirname, '../../'),
  releaseAssets: ['LICENSE', 'README.md', 'CHANGELOG.md'],
  src: {
    base: 'modules',
    js: ['./gulpfile.js', './tools/gulp/*.js'],
    ts: 'modules/**/*.ts'
  },
  dev: 'dev',
  dist: {
    base: 'dist',
    bundles: 'dist/bundles'
  }
};

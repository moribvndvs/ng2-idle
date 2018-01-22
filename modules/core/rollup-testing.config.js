import uglify from 'rollup-plugin-uglify';

var ugly = process.env.npm_config_mode === 'ugly';

export default {
  entry: 'dist/core/testing/index.js',
  dest: ugly ? 'dist/core/bundles/core-testing.umd.min.js' : 'dist/core/bundles/core-testing.umd.js',
  format: 'umd',
  moduleName: 'ngidle.core.testing',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Rx': 'Rx',
    '@ng-idle/core': 'ngidle.core'
  },
  plugins: ugly ? [
    uglify()
  ] : []
};

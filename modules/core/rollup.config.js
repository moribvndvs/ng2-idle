import uglify from 'rollup-plugin-uglify';

var ugly = process.env.npm_config_mode === 'ugly';

export default {
  entry: 'dist/core/index.js',
  dest: ugly ? 'dist/core/bundles/core.umd.min.js' : 'dist/core/bundles/core.umd.js',
  format: 'umd',
  moduleName: 'ngidle.core',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Rx': 'Rx'
  },
  plugins: ugly ? [
    uglify()
  ] : []
};

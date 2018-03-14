import uglify from 'rollup-plugin-uglify';

var ugly = process.env.npm_config_mode === 'ugly';

export default {
  entry: 'dist/keepalive/index.js',
  dest: ugly ? 'dist/keepalive/bundles/keepalive.umd.min.js' : 'dist/keepalive/bundles/keepalive.umd.js',
  format: 'umd',
  moduleName: 'ngidle.keepalive',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common/http': 'ng.http',
    'rxjs/Rx': 'Rx',
    '@ng-idle/core': 'ng.core'
  },
  plugins: ugly ? [
    uglify()
  ] : []
};

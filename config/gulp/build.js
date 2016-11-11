const gulp = require('gulp');
const config = require('./config');
const ts = require('gulp-typescript');
const path = require('path');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');
const ms = require('merge-stream');
const util = require('./util');

function createTsProject(root, opt) {
  return ts.createProject('./tsconfig.json', opt);
}

function createSrc(root, ignoreSpecs) {
  var opt = [
    // 'typings/browser.d.ts',
    path.join(root, '**/*.ts')
  ];

  if (ignoreSpecs === true) {
    opt.push('!' + path.join(root, '**/*.spec.ts'));
  }

  return opt;
}

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' # @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

gulp.task('build:dist', function() {
  var folders = util.getFolders(config.PATHS.src.base);

  var tasks = folders.map(function(folder) {
    var src = path.join('modules', folder);
    var dest = path.join(config.PATHS.dist.base, folder);

    var tsProj = createTsProject(src, {
      target: 'ES5',
      module: 'ES6',
      declaration: true
    });

    var pkg = require(path.join('../../', src, 'package.json'));
    pkg.version = config.pkg.version;

    var tsResult = gulp.src(createSrc(src, true))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(tsProj());

    return ms([
      tsResult.dts.pipe(header(banner, {
        pkg: pkg
      }))
      .pipe(gulp.dest(dest)),
      tsResult.js.pipe(header(banner, {
        pkg: pkg
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dest))
    ]);
  });

  return ms(tasks);
});

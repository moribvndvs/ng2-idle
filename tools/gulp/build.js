const gulp = require('gulp');
const config = require('./config');
const ts = require('gulp-typescript');
const path = require('path');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const merge = require('merge2');
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');

function createTsProject(opt) {
  return ts.createProject(path.join(config.PATHS.root, './tsconfig.json'), opt);
}

function createSrc(includeSpecs) {
  var opt = [
    'typings/browser.d.ts',
    path.join(config.PATHS.src.base, '**/*.ts')
  ];

  if (includeSpecs === true) {
    opt.push('!' + path.join(config.PATHS.src.base, '**/*.spec.ts'));
  }

  return opt;
}

gulp.task('build:dev', function() {
  return gulp.src(createSrc())
    .pipe(plumber())
    .pipe(ts(createTsProject()))
    .pipe(gulp.dest(config.PATHS.dev));
});

gulp.task('build:dev:watch', function(done) {
  runSequence('build:dev', 'watch:dev', done);
});

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' # @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('build:dist:ts', function() {
  return gulp.src(config.PATHS.src.ts)
    .pipe(header(banner, {pkg: config.pkg}))
    .pipe(gulp.dest(config.PATHS.dist.ts));
});

gulp.task('build:dist:cjs', function() {
  var tsProj = createTsProject();
  tsProj.options.declaration = true;

  var tsResult = gulp.src(createSrc(true))
                  .pipe(plumber())
                  .pipe(sourcemaps.init())
                  .pipe(ts(tsProj));

  return merge([
    tsResult.dts.pipe(header(banner, {pkg: config.pkg}))
      .pipe(gulp.dest(config.PATHS.dist.cjs)),
    tsResult.js.pipe(header(banner, {pkg: config.pkg}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.PATHS.dist.cjs))
  ]);
});

gulp.task('build:dist:es6', function() {
  var taskConfig = createTsProject({
    module: 'ES6',
    target: 'ES6',
    emitDecoratorMetadata: true,
    experimentalDecorators: true
  });

  // ignore dup errors until https://github.com/angular/angular/issues/4882
  var tsResult = gulp.src(config.PATHS.src.ts)
                  .pipe(sourcemaps.init())
                  .pipe(ts(taskConfig, undefined, ts.reporter.nullReporter()));

  return tsResult.js.pipe(sourcemaps.write('.'))
    .pipe(header(banner, {pkg: config.pkg}))
    .pipe(gulp.dest(config.PATHS.dist.es6));
});

gulp.task('build:dist', function(done) {
  runSequence('clean:dist',
    'lint',
    ['release:copy-assets', 'release:fix-package', 'build:dist:ts',
      'build:dist:cjs', 'build:dist:es6'],
    'bundle',
    done);
});

gulp.task('build', ['build:dist']);

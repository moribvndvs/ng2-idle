const gulp = require('gulp');
const path = require('path');
const config = require('./config');
const cclog = require('gulp-conventional-changelog');
const jeditor = require('gulp-json-editor');

gulp.task('release:copy-assets', function copyReleaseAssets() {
  return gulp.src(config.PATHS.releaseAssets)
    .pipe(gulp.dest(config.PATHS.dist.base));
});

gulp.task('release:fix-package', function fixPackage() {
  return gulp.src(path.join(config.PATHS.root, './package.json'))
    .pipe(jeditor(function(json) {
      json.scripts = {};
      return json;
    }))
    .pipe(gulp.dest(path.join(config.PATHS.root, config.PATHS.dist.base)));
});

gulp.task('release:changelog', function changelog() {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
  .pipe(cclog({
    preset: 'angular'
  }))
  .pipe(gulp.dest('.'));
});

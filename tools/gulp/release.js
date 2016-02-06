const gulp = require('gulp');
const config = require('./config');
const cclog = require('gulp-conventional-changelog');

gulp.task('release:copy-assets', function copyReleaseAssets() {
  return gulp.src(config.PATHS.releaseAssets)
    .pipe(gulp.dest(config.PATHS.dist.base));
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

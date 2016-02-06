const gulp = require('gulp');
const del = require('del');
const config = require('./config');

gulp.task('clean:dev', function cleanDev() {
  return del([config.PATHS.dev]);
});
gulp.task('clean:dist', function cleanDist() {
  return del([config.PATHS.dist.base]);
});

gulp.task('clean', ['clean:dev', 'clean:dist']);

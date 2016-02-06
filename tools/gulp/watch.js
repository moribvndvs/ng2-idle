const gulp = require('gulp');
const config = require('./config');
const path = require('path');
const watch = require('gulp-watch');

gulp.task('watch:dev', function() {
  watch(path.join(config.PATHS.src.base, '**/*.ts'), function() {
    gulp.start('build:dev');
  });
});

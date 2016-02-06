const gulp = require('gulp');
const bump = require('gulp-bump');

function doBump(type) {
  return gulp.src(['./package.json'])
    .pipe(bump({
      type: type
    }))
    .pipe(gulp.dest('./'));
}

gulp.task('bump:patch', function() {
  return doBump('patch');
});

gulp.task('bump:minor', function() {
  return doBump('minor');
});

gulp.task('bump:major', function() {
  return doBump('major');
});

gulp.task('bump', ['bump:patch']);

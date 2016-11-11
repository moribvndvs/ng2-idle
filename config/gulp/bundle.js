const gulp = require('gulp');
const run = require('gulp-run');

gulp.task('bundle:umd', function() {
  return gulp.src('modules/**/rollup*.config.js')
    .pipe(run('./node_modules/.bin/rollup -c ${ file.path }', {verbosity: 1}));
});

gulp.task('bundle:umd:min', function() {
  return gulp.src('modules/**/rollup*.config.js')
    .pipe(run('MODE=ugly ./node_modules/.bin/rollup -c ${ file.path }', {verbosity: 1}));
});

gulp.task('bundle', ['bundle:umd', 'bundle:umd:min']);

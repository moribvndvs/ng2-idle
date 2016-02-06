const gulp = require('gulp');
const config = require('./config');
const path = require('path');
const tslint = require('gulp-tslint');
const eslint = require('gulp-eslint');
const clangFormat = require('gulp-clang-format');
const runSequence = require('run-sequence');

gulp.task('tslint', () => {
  return gulp.src(config.PATHS.src.tsAll)
    .pipe(tslint({
      configuration: require('../../tslint.json')
    }))
    .pipe(tslint.report('verbose'));
});

gulp.task('eslint', () => {
  return gulp.src(config.PATHS.src.js)
    .pipe(eslint({
      rulePaths: [path.join(__dirname, '../../')]
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('clang:check', () => {
  return gulp.src(config.PATHS.src.tsAll)
     .pipe(clangFormat.checkFormat('file', undefined,
      {verbose: true, fail: true}));
});

gulp.task('clang:format', () => {
  return gulp.src(config.PATHS.src.tsAll)
     .pipe(clangFormat.format('file'))
     .pipe(gulp.dest(config.PATHS.src.base));
});

gulp.task('lint', function(done) {
  runSequence('clang:check', 'tslint', 'eslint', done);
});

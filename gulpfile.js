// load all files in gulp dir
require('require-dir')('./tools/gulp');
const gulp = require('gulp');
const runSequence = require('run-sequence');

// all grunt tasks, which are defined here, are intended for use via the CLI.
// gulp.task('build', function build(done) {
//   runSequence('clean:dist', ['build:copy-assets', 'scripts', 'bundle'], done);
// });

gulp.task('test', function(done) {
  runSequence('clean:dev', 'build:dev', 'karma:start', done);
});

gulp.task('test:watch', function(done) {
  runSequence('clean:dev', 'build:dev', 'karma:start:watch', done);
});

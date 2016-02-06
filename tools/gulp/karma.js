const gulp = require('gulp');
const config = require('./config');
const Server = require('karma').Server;

gulp.task('karma:start', function(done) {
  new Server({
    configFile: config.PATHS.root + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  }).start();
});

gulp.task('karma:start:watch', function(done) {
  new Server({
    configFile: config.PATHS.root + '/karma.conf.js',
    singleRun: false,
    browsers: ['Chrome']
  }, function() {
    done();
  }).start();
});

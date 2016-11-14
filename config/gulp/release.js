const gulp = require('gulp');
const path = require('path');
const config = require('./config');
const cclog = require('gulp-conventional-changelog');
const jeditor = require('gulp-json-editor');
const ms = require('merge-stream');
const util = require('./util');
const runSequence = require('run-sequence');

gulp.task('release:copy-assets', function copyReleaseAssets() {

  var folders = util.getFolders(config.PATHS.src.base);

  var tasks = folders.map(function(folder) {
    var src = path.join('modules', folder);
    var dest = path.join(config.PATHS.dist.base, folder);

    return gulp.src(config.PATHS.releaseAssets)
      .pipe(gulp.dest(dest));
  });

  return ms(tasks);
});

gulp.task('release:package', function fixPackage() {
  var folders = util.getFolders(config.PATHS.src.base);

  var tasks = folders.map(function(folder) {
    var src = path.join('modules', folder, './package.json');
    var dest = path.join(config.PATHS.dist.base, folder);

    return gulp.src(src)
      .pipe(jeditor(function(json) {
        json.version = config.pkg.version;
        json.peerDependencies = Object.assign({}, config.pkg.dependencies);

        if (folder !== 'keepalive') {
          delete json.peerDependencies["@angular/http"];
        } else {
          json.peerDependencies['@ng-idle/core'] = '^' + config.pkg.version;
        }

        return json;
      }))
      .pipe(gulp.dest(dest));
  });

  return ms(tasks);
});

gulp.task('release:changelog', function changelog() {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
  .pipe(cclog({
    preset: 'angular'
  })).pipe(gulp.dest('.'));
});

gulp.task('release', function(done) {
  runSequence('release:changelog', 'release:package', 'release:copy-assets', done);
});

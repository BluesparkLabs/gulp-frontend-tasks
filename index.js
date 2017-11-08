'use strict';

var argv = require('yargs').argv,
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    gulpif = require('gulp-if'),
    liveReload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    sassGlob = require('gulp-sass-glob'),
    sourceMaps = require('gulp-sourcemaps'),
    wait = require('gulp-wait');

// CSS minification is disabled by default, you can enable with --minify.
var minify = (typeof argv.minify !== 'undefined');

// Sourcemaps are enabled by default, you can disable them with --no-sourcemaps.
var noSourceMaps = (typeof argv['no-sourcemaps'] !== 'undefined');

// Live reload is enabled by default, you can disable it with --no-livereload.
var noLiveReload = (typeof argv['no-livereload'] !== 'undefined');

// You may specify a delay in milliseconds for LiveReload so that it doesn't
// get triggered right away after compiling sass files.
var liveReloadDelay = (!noLiveReload && typeof argv['livereload-delay'] !== 'undefined') ? argv['livereload-delay'] : 0;


// Production mode is the functional equivalent of specifying the following:
//   --minify --no-sourcemaps --no-livereload
// specifying the --production argument overrides any individual argument.
var production = typeof argv.production !== 'undefined';
if (production) {
  minify = noSourceMaps = noLiveReload = true;
}

// Define paths in the filesystem for easy access.
var paths = {
  'css': 'css',
  'scss': ['scss/**/*.scss', 'sass/**/*.scss']
};

module.exports = function (gulp) {

  /**
   * Task: Default —> Build.
   */
  gulp.task('default', ['build']);

  /**
   * Task: Build.
   */
  gulp.task('build', ['sass:lint', 'sass']);

  /**
   * Task: Watch.
   *
   * Continuously watches for changes in Sass and JS files and runs tasks
   * accordingly.
   */
  gulp.task('watch', ['build'], function () {
    if (!noLiveReload) {
      liveReload.listen();
    }
    gulp.watch(paths.scss, ['sass:lint', 'sass']);
  });

  /**
   * Task: Compiles Sass files to CSS.
   */
  gulp.task('sass', function () {
    return gulp.src(paths.scss)
      .pipe(gulpif(!noSourceMaps, sourceMaps.init()))
      .pipe(sassGlob().on('error', sass.logError))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({ cascade: false }))
      .pipe(gulpif(minify, cleanCSS({compatibility: 'ie8'})))
      .pipe(gulpif(!noSourceMaps, sourceMaps.write('')))
      .pipe(gulp.dest(paths.css))
      .pipe(gulpif(liveReloadDelay, wait(liveReloadDelay)))
      .pipe(gulpif(!noLiveReload, liveReload()));
  });

  /**
   * Task: Lints Sass files.
   */
  gulp.task('sass:lint', function () {
    return gulp.src(paths.scss)
      .pipe(sassLint({
        files: {ignore: 'scss/base/_normalize.scss'}
      }))
      .pipe(sassLint.format())
  });

};

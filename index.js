'use strict';

var argv = require('yargs').argv,
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    sassGlob = require('gulp-sass-glob'),
    sourceMaps = require('gulp-sourcemaps'),
    wait = require('gulp-wait');

// CSS minification is disabled by default, you can enable with --minify.
var minify = (typeof argv.minify !== 'undefined');

// Sourcemaps are enabled by default, you can disable them with --no-sourcemaps.
var noSourceMaps = (typeof argv['no-sourcemaps'] !== 'undefined');

// BrowserSync is enabled by default when runing `gulp watch`, you can disable it with --no-browsersync.
var noBrowserSync = (typeof argv['no-browsersync'] !== 'undefined');

// You may specify a delay in milliseconds for BrowserSync so that it doesn't
// get triggered right away after compiling sass files.
var browserSyncDelay = (!noBrowserSync && typeof argv['browsersync-delay'] !== 'undefined') ? argv['browsersync-delay'] : 0;

// Production mode is the functional equivalent of specifying the following:
//   --minify --no-sourcemaps --no-browsersync
// specifying the --production argument overrides any individual argument.
var production = typeof argv.production !== 'undefined';
if (production) {
  minify = noSourceMaps = noBrowserSync = true;
}

// Define paths in the filesystem for easy access.
var paths = {
  'css': 'css',
  'scss': ['scss/**/*.scss', 'sass/**/*.scss']
};

module.exports = function (gulp) {

  /**
   * Task: Run the BrowserSync server.
   */
  gulp.task('browsersync', function() {
    browserSync.init();
  });

  /**
   * Task: Compiles Sass files to CSS.
   */
  gulp.task('sass', function () {
    return gulp.src(paths.scss)
      .pipe(gulpif(!noSourceMaps, sourceMaps.init()))
      .pipe(sassGlob().on('error', sass.logError))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({cascade: false}))
      .pipe(gulpif(minify, cleanCSS({compatibility: 'ie8'})))
      .pipe(gulpif(!noSourceMaps, sourceMaps.write('')))
      .pipe(gulp.dest(paths.css))
      .pipe(gulpif(browserSyncDelay, wait(browserSyncDelay)))
      .pipe(browserSync.stream());
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

  /**
   * Task: Build.
   */
  gulp.task('build', gulp.series('sass:lint', 'sass'));

  /**
   * Task: Default —> Build.
   */
  gulp.task('default', gulp.series('build'));

  /**
   * Task: Watch.
   *
   * Continuously watches for changes in Sass and JS files and runs tasks
   * accordingly.
   */
  gulp.task('watch', gulp.series('build'), function () {
    if (!noBrowserSync) {
      browserSync.init();
    }
    gulp.watch(paths.scss, ['sass:lint', 'sass']);
  });

};

'use strict';

var argv = require('yargs').argv,
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    gulpif = require('gulp-if'),
    liveReload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    sourceMaps = require('gulp-sourcemaps'),
    wait = require('gulp-wait');

// Set up a boolean variable based on the `--production` flag passed to the
// gulp command in case the tasks are supposed to prepare the codebase to be
// used in production.
var production = typeof argv.production !== 'undefined';

// Allow to delay livereload execution so that it doesn't get triggered right
// away after compiling sass files.
var livereloadDelay = (typeof argv['livereload-delay'] !== 'undefined') ? argv['livereload-delay'] : 0;

// Define paths in the filesystem for easy access.
var paths = {
  'css': 'css',
  'scss': 'scss/**/*.scss',
  'scssEntrypoint': [
    'scss/style.scss',
    'scss/print.scss'
  ]
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
    if (!production) {
      liveReload.listen();
    }
    gulp.watch(paths.scss, ['sass:lint', 'sass']);
  });

  /**
   * Task: Compiles Sass files to CSS.
   */
  gulp.task('sass', function () {
    return gulp.src(paths.scssEntrypoint)
      .pipe(gulpif(!production, sourceMaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({ cascade: false }))
      .pipe(gulpif(production, cleanCSS({compatibility: 'ie8'})))
      .pipe(gulpif(!production, sourceMaps.write()))
      .pipe(gulp.dest(paths.css))
      .pipe(wait(livereloadDelay))
      .pipe(gulpif(!production, liveReload()));
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

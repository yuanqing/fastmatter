var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var rimraf = require('gulp-rimraf');

var paths = {
  src: ['index.js'],
  test: ['spec/**/*.spec.js'],
  coverage: './coverage'
};

gulp.task('lint', function() {
  return gulp.src([__filename].concat(paths.src).concat(paths.test))
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
  return gulp.src(paths.test)
    .pipe(plumber())
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: true
    }));
});

gulp.task('cov', ['clean'], function() {
  return gulp.src(paths.src)
    .pipe(plumber())
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(paths.test)
        .pipe(jasmine())
        .pipe(istanbul.writeReports({
          dir: paths.coverage,
          reporters: ['lcov', 'text-summary']
        }));
    });
});

gulp.task('clean', function () {
  return gulp.src(paths.coverage, { read: false })
    .pipe(plumber())
    .pipe(rimraf());
});

gulp.task('watch', function() {
  gulp.watch(paths.src, [
    'lint',
    'test',
  ]);
});

gulp.task('default', [
  'lint',
  'cov',
]);

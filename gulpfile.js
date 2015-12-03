var gulp = require('gulp')
var rename = require('gulp-rename')
var babel = require('gulp-babel')
var browserify = require('gulp-browserify')
var sass = require('gulp-sass')

gulp.task('default', function() {
  return gulp.src('./menu.js')
    .pipe(babel())
    .pipe(browserify({
      debug: false,
      insertGlobals: true
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./'))
})

gulp.task('sass', function() {
  gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
})

gulp.task('watch', function() {
  gulp.watch('./css/*.scss', ['sass'])
  gulp.watch('./menu.js', ['default'])
})

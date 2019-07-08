const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpsync = require('gulp-sync')(gulp);
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const importCss = require('gulp-cssimport');
const sourcemaps = require('gulp-sourcemaps');
const pug  = require('gulp-pug');
const imagemin = require('gulp-imagemin');

const distFolder = './build/';

sass.compiler = require('node-sass');

gulp.task('watch', function () {
  watch(['./src/assets/scss/**/*.scss'], () => {
    gulp.run('sass');
    browserSync.reload();
  });
  watch(['./src/assets/images/**/*.*'], () => {
    gulp.run('images');
    browserSync.reload();
  });
  watch(['./src/assets/fonts/**/*.*'], () => {
    gulp.run('fonts');
    browserSync.reload();
  });
  watch(['./*.html'], () => {
    gulp.run('copy');
    browserSync.reload();
  });
  watch(['./src/**/*.pug'], () => {
    gulp.run('pug');
    browserSync.reload();
  });
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
});

gulp.task('clean', function () {
  return gulp.src([distFolder + '/css', distFolder + '/fonts', distFolder + '/images'], {read: false})
      .pipe(clean({
        force: true,
      }));
});

gulp.task('sass', function () {
  return gulp.src('./src/assets/scss/app.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(importCss({}))
      .pipe(gulp.dest(distFolder + 'css'));
});

gulp.task('fonts', function () {
  gulp.src('./src/assets/fonts/**/*.*')
      .pipe(gulp.dest(distFolder + 'fonts'));
});

gulp.task('images', function () {
  gulp.src('./src/assets/images/**/*.*')
      .pipe(imagemin())
      // .pipe(image())
      .pipe(gulp.dest(distFolder + 'images'));
});

gulp.task('copy', function () {
  gulp.src('./*.html')
      .pipe(gulp.dest('./build/'));
});

gulp.task('pug', () => {
  return gulp.src('./src/templates/pages/*.pug').pipe(pug()).pipe(gulp.dest('./build/'));
});

gulp.task('build', gulpsync.sync(['clean', 'pug', 'sass', 'images', 'fonts']));
gulp.task('dev', gulpsync.sync(['build', 'watch', 'browser-sync']));

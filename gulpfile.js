const { src, dest, series, parallel, watch } = require('gulp');
const less = require('gulp-less');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const reload = browserSync.reload;
const del = require('del');

const path = {
  dist: {
    includes: 'dist/includes/',
    php: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  app: {
    php: 'app/**/*.php',
    includes: 'app/includes/*.{php,html}',
    js: 'app/js/**/*.*',
    less: 'app/less/*.less',
    css: 'app/css/*.css',
    img: 'app/img/**/*.*',
    fonts: 'app/fonts/**/*.*'
  }
};

function browserSync() {
  browsersync.init({
    proxy: 'recram',
    port: 3000
  });

  watch(path.app.less, css);
  watch(path.app.js).on('change', browsersync.reload);
  watch(path.app.includes).on('change', browsersync.reload);
}

function css() {
  return src(path.app.less)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(dest('app/css'))
    .pipe(browsersync.stream());
}

// copy php
function copyPhp() {
  return src(path.app.php).pipe(dest(path.dist.php));
}

// copy includes
function copyInc() {
  return src(path.app.includes).pipe(dest(path.dist.includes));
}

// copy fonts
function copyFonts() {
  return src(path.app.fonts).pipe(dest(path.dist.fonts));
}

// copy css
function copyCss() {
  return src(path.app.css)
    .pipe(cleancss({ compatibility: 'ie8' }))
    .pipe(dest(path.dist.css));
}

// copy js
function copyJs() {
  return src(path.app.js).pipe(uglify()).pipe(dest(path.dist.js));
}

// copy img
function copyImg() {
  return src(path.app.img).pipe(imagemin()).pipe(dest(path.dist.img));
}

// clean dist
function clean() {
  return del('dist');
}

exports.default = browserSync;
exports.build = series(
  clean,
  parallel(copyCss, copyFonts, copyImg, copyPhp, copyInc, copyJs)
);

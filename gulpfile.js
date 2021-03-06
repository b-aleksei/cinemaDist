const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const twig = require('gulp-twig');

const html = () => {
  return gulp.src(['source/html/pages/*.twig', 'source/html/modal/*.twig'])
    .pipe(twig({
      data: {
        // title: 'Gulp and Twig',
        benefits: [
          'Fast',
          'Flexible',
          'Secure'
        ]
      }
    }))
    .pipe(gulp.dest('build/'));
};


const css = () => {
  return gulp.src('source/sass/style.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([autoprefixer({
        grid: true,
      })]))
      .pipe(gulp.dest('build/css'))
      .pipe(csso())
      .pipe(rename('style.min.css'))
      .pipe(sourcemap.write('.'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
};

const js = () => {
  return gulp.src(['source/js/main.js'])
      .pipe(webpackStream(webpackConfig))
      .pipe(gulp.dest('build/js'))
};

const svgo = () => {
  return gulp.src('source/1/*.svg')
      .pipe(imagemin([
        imagemin.svgo({
            plugins: [
              {removeViewBox: false},
              {removeRasterImages: true},
              {removeUselessStrokeAndFill: false},
            ]
          }),
      ]))
      .pipe(gulp.dest('source/1'));
};

const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('sprite_svg.twig'))
      .pipe(gulp.dest('source/html/base'));
};

const syncserver = () => {
  server.init({
    server: 'build/',
    startPath: "/_index.html",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/html/**/*.twig', gulp.series(html, refresh));
  gulp.watch('source/sass/**/*.{scss,sass}', {usePolling: true}, gulp.series(css));
  gulp.watch('source/js/**/*.{js,json}', gulp.series(js, refresh));
  gulp.watch('source/data/**/*.{js,json}', gulp.series(copy, refresh));
  gulp.watch('source/img/sprite/*.svg', gulp.series(sprite, html, refresh));
  gulp.watch('source/img/**/*.{png,jpg,webp,svg}', gulp.series(copyImg, html, refresh));
};

const refresh = (done) => {
  server.reload();
  done();
};

const copyImg = () => {
  return gulp.src('source/img/**/*.{png,jpg,webp,svg}', {base: 'source'})
      .pipe(gulp.dest('build'));
};

const copy = () => {
  return gulp.src([
    'source/fonts/**',
    'source/favicon/**',
    'source/img/**',
    'source/data/**',
    'source/file/**',
    'source/*.php',
    'source/video/**', // учтите, что иногда git искажает видеофайлы, некоторые шрифты, pdf и gif - проверяйте и если обнаруживаете баги - скидывайте тестировщику такие файлы напрямую
    'source/downloads/**',
  ], {
    base: 'source',
  })
      .pipe(gulp.dest('build'));
};


const clean = () => {
  return del('build');
};

const build = gulp.series(clean, svgo, copy, css, sprite, js, html);

const start = gulp.series(build, syncserver);

// Optional tasks
const createWebp = () => {
  return gulp.src('source/1/**/*.{png,jpg}')
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('source/1'));
};

const optimizeImages = () => {
  return gulp.src('build/img/**/*.{png,jpg}')
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
      ]))
      .pipe(gulp.dest('build/img'));
};

exports.build = build;
exports.html = html;
exports.svgo = svgo;
exports.start = start;
exports.webp = createWebp;
exports.imagemin = optimizeImages;

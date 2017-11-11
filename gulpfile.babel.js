import gulp from 'gulp';
import loadGulpPlugins from 'gulp-load-plugins';
import { argv } from 'yargs';
import del from 'del';
import cp from 'child_process';

import autoprefixer from 'autoprefixer';
import mqpacker from "css-mqpacker";

const $ = loadGulpPlugins();

gulp.task('clean', () => (
  del([
    './_site/css',
    './_site/js',
    './_site/img',
    './_site/fonts',
  ])
));

gulp.task('copy', () => {
  gulp.src([
    './src/fonts/**/*',
    './src/img/**/*',
    '!./src/img/svg/icons',
    '!./src/img/svg/icons/**/*'
  ], {
    base: './src'
  })
  .pipe(gulp.dest('./build/'));
})

gulp.task('build:scripts', () => (
  gulp.src('./src/js/app.js')
    .pipe($.include())
    .pipe($.if(argv.production, $.uglify()))
    .pipe(gulp.dest('./build/js'))
))

gulp.task('build:styles', () => (
  gulp.src('./src/sass/*.sass')
    .pipe($.sass().on('error', $.notify.onError({
      title: 'Sass Error!',
      message: '<%= error.message %>'
    })))
    .pipe($.postcss([
      autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
      }),
      mqpacker({
        sort: function (a, b) {
          a = a.replace(/\D/g,'');
          b = b.replace(/\D/g,'');
          return a-b;
        }
      })
    ]))
    .pipe($.concatCss('style.css'))
    .pipe($.cleanCss({compatibility: 'ie8'}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
));

gulp.task('build:jekyll', (cb) => (
  cp.spawn('jekyll', ['build', '--config', './_config.yml'], { stdio: 'inherit' }) // Adding incremental reduces build time.
    .on('error', (error) => $.util.log($.util.colors.red(error.message)))
    .on('close', cb)
));

gulp.task('serve', () => (
  cp.spawn('jekyll', ['serve', '--incremental'], { stdio: 'inherit' }) // Adding incremental reduces build time.
    .on('error', (error) => $.util.log($.util.colors.red(error.message)))
));

gulp.task('build', $.sequence('clean', 'build:jekyll', ['build:scripts', 'build:styles', 'copy']));

gulp.task('watch', ['build'], () => {
  gulp.watch(`./src/sass/**`, ['build:styles']);
  gulp.watch(`./src/js/**`, ['build:scripts']);
});

gulp.task('dev', (done) => {
  process.env.WATCH = 'true';
  return $.sequence(['watch', 'serve'])(done)
});

gulp.task('prefix', () => (
  gulp.src(`./_site/**/*.html`)
  .pipe($.prefix('/', [
    {match: "img[src]", attr: "src"},
    {match: "a[href]", attr: "href"}, // this selector was added to the default set of selectors
    {match: "script[src]", attr: "src"},
    {match: "link[href]", attr: "href"},
    {match: "input[src]", attr: "src"},
    {match: "img[data-ng-src]", attr: "data-ng-src"}
  ]))
  .pipe(gulp.dest('./_site'))
));

gulp.task('production', (done) => {
  process.env.NODE_ENV = 'production';
  process.env.WATCH = 'false';
  return $.sequence('build')(done);
});

gulp.task('export', $.sequence('production', 'build:jekyll'));

gulp.task('deploy:build', $.sequence('production', 'build:jekyll', 'prefix'));
gulp.task('deploy', ['deploy:build'], () => (
  gulp.src(`./_site/**/*`).pipe($.ghPages()))
);

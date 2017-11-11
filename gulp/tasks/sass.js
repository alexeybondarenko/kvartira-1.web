var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var notify = require('gulp-notify');
var mqpacker = require("css-mqpacker");
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var config = require('../config');


gulp.task('sass', function() {

    var processors = [
        autoprefixer({browsers: ['last 10 versions'], cascade: false}),
        mqpacker({
            sort: function (a, b) {
                a = a.replace(/\D/g,'');
                b = b.replace(/\D/g,'');
                return a-b;
            }
        })
    ];

    return gulp.src(config.src.sass+'*.sass')
    .pipe(sass().on('error', notify.onError({
      title: 'Sass Error!',
      message: '<%= error.message %>'
    })))
    .pipe(postcss(processors))
    .pipe(concatCss('style.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest.css));
});

gulp.task('sass:watch', function() {
    gulp.watch(config.src.sass + '/**/*', ['sass']);
});

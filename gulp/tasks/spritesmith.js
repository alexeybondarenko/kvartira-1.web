var gulp = require('gulp');
var notify = require('gulp-notify');
var config = require('../config');
var imagemin = require('gulp-imagemin');
var debug = require('gulp-debug');
var gulpIf = require('gulp-if');
var argv = require('yargs').argv;

gulp.task('images', function() {
    return gulp.src([
        './src/img/**/*',
        '!./src/img/icons/*', '!./src/img/icons'
    ])
        .pipe(gulpIf(argv.production, imagemin()))
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('images:watch', function() {
    gulp.watch(config.src.img, ['images']);
});


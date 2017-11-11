var gulp = require('gulp');
var include = require("gulp-include");
var config = require('../config');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var gulpIf =  require('gulp-if');
reload = browserSync.reload;

gulp.task('js', function () {
    gulp.src([
        config.src.js+'app.js'
    ])
        .pipe(include())
        .pipe(gulpIf(argv.production, uglify()))
        .pipe(gulp.dest(config.dest.js))
        .pipe(reload({stream: true}));
});

gulp.task('js:watch', function() {
    gulp.watch(config.src.js+'*', ['js']);
});

var gulp  = require('gulp');
var argv = require('yargs').argv;
var config = require('../config');
var browserSync = require('browser-sync');
var htmlmin = require('gulp-htmlmin');
var gulpIf = require('gulp-if');
var debug = require('gulp-debug');
var notify = require('gulp-notify');

var jade = require('gulp-jade');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var prefix = require('gulp-prefix');
var data = require('gulp-data');

var cards = require('../../src/data/cards.json')

reload = browserSync.reload;

gulp.task('html', function () {
  console.log(cards)
    gulp.src(config.src.jade+'pages/*.jade')
      .pipe(data(function(file) {
        return {
          cards: require('../../src/data/cards.json'),
        }
      }))
      .pipe(jade().on('error', function(){notify("Jade compile error");}))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(config.dest.html))
      .pipe(reload({stream: true}));
});

gulp.task('html:watch', function() {
    gulp.watch([
    	config.src.jade+'**/*',
    ], ['html']);
});

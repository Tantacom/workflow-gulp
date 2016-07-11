'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var serve = require('gulp-serve');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');
var jade = require('gulp-jade');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');

/*var jshint = require('gulp-jshint');*/

var source_paths = {  
  sass: './dev/sass/**/*.scss',
  js: './dev/js/**',
  html: './dev/html/**',
  images: './dev/images/**',
}

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var DIST = 'dist';
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed'
};

gulp.task('sass', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jade-watch', ['jade']);
gulp.task('jade', function () {
  return gulp.src('./dev/jade/*.jade')
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest('./.tmp/'))
});


gulp.task('compress', function() {
    gulp.src(['./dev/js/lang_ES.js', './dev/js/common.js'])
    .pipe(concat('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});


/*gulp.task('jslint', function() {
  return gulp.src(source_paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});*/

gulp.task('clean', function() {
  return del.sync(['./dist/**/*', './.tmp/**/*']);
});

gulp.task('imagemin', ['clean'], function() {
  gulp.src(source_paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'));
});
//'./dev/html/*.html'
gulp.task('copy', ['jade'], function() {
  gulp.src(['./.tmp/*.html'])
    .pipe(htmlreplace({
        'js': 'js/bundle.min.js'
    }))
    .pipe(gulp.dest('./dist'));

  gulp.src(source_paths.images)
    .pipe(gulp.dest('./dist/images'));

  gulp.src([source_paths.js, '!dev/js/lang_ES.js', '!dev/js/common.js'])
    .pipe(gulp.dest('./dist/js'));
})


gulp.task('browser-sync', function(){
  browserSync.init(["./dist/*.html", "./dist/css/*.css", "./dist/js/*.js"], {
    notify: true,
    server: {
      baserDir: ["./", "./dist"],
      directory: true
    }
  });
});





gulp.task('watch', ['clean','jade-watch', 'sass', 'imagemin', 'compress', 'copy', 'browser-sync'], function() {
  gulp.watch(source_paths.sass, ['sass']);
  gulp.watch('./dev/jade/**/*.jade', ['jade-watch']);
  gulp.watch('./.tmp/*.html', ['copy']);
  gulp.watch(source_paths.js, ['clean', 'copy']);
  gulp.watch(source_paths.images, ['clean', 'imagemin', 'copy']);
});


gulp.task('default', ['watch']);
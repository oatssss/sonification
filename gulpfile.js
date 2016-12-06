/**
* Gulpfile to make my life easier.
*/

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

gulp.task('build', function() {
    return browserify({
        entries: './js/app.js',
        debug: true
    })
    .transform(babelify, {
        presets: [
            'es2015',
            'react',
            'stage-0',
        ],
        plugins: [
            'transform-decorators-legacy',
            'transform-object-rest-spread'
        ]
    })
    .on('error', function(e) {
        gutil.log(e);
        this.emit('end');
    })
    .bundle()
    .on('error', function(e) {
        gutil.log(e);
        this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public_html'));
});

gulp.task('watch', function() {
    gulp.watch('js/**/*.js*',['build'])
});

gulp.task('default', ['build', 'watch']);

'use strict';

require('./gulpTasks/dev');
require('./gulpTasks/dist');

var gulp = require('gulp'),
    runSequence = require('run-sequence');

gulp.task('build:all:release', function (done) {
    runSequence(
        'dist:release',
        done
    );
});

gulp.task('build:all', function (done) {
    runSequence(
        'dist:default',
        done
    );
});

gulp.task('default', ['build:all:release']);

gulp.task('watch', ['dev:watch']);
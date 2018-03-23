const gulp = require('gulp');
const del = require('del');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const responsive = require('gulp-responsive');
const imageMin = require('gulp-imagemin');
const htmlMin = require('gulp-htmlmin');
const minifyCss = require('gulp-clean-css');
const minifyJs = require('gulp-uglify-es').default;
const runSequence = require('run-sequence');


['', 'views'].forEach(prefix => {

    const taskPrefix = prefix ? `${prefix}:` : '';
    const folderPrefix = prefix ? `./${prefix}/` : './';

    const pathImages = `${folderPrefix}images`;
    const pathCss = `${folderPrefix}css`;
    const pathJs = `${folderPrefix}js`;


    
    /* images */

    gulp.task(`${taskPrefix}clean:images`, function () {
        return del(`${pathImages}/*.min.*`);
    });

    gulp.task(`${taskPrefix}minify:images`, function () {
        return gulp.src([`${pathImages}/*.*`, `!${pathImages}/*.min.*`])
            .pipe(imageMin({
                verbose: false
            }))
            .pipe(rename(function (path) {
                path.extname = '.min' + path.extname;
            }))
            .pipe(gulp.dest(`${pathImages}`));
    });

    gulp.task(`${taskPrefix}build:images`, function () {
        return runSequence(
            `${taskPrefix}clean:images`,
            `${taskPrefix}minify:images`
        );
    });


    /* html */

    gulp.task(`${taskPrefix}minify:html`, function() {
        return gulp.src([`${folderPrefix}*.src-html`])
          .pipe(htmlMin({collapseWhitespace: true}))
          .pipe(rename(function (path) {
            path.extname = '.html';
            }))
          .pipe(gulp.dest(folderPrefix)
        );
    });

    gulp.task(`${taskPrefix}build:html`, function () {
        return runSequence(
            `${taskPrefix}minify:html`
        );
    });


    /* css */

    gulp.task(`${taskPrefix}clean:css`, function () {
        return del(`${pathCss}/*.min.css`);
    });

    gulp.task(`${taskPrefix}minify:css`, function () {
        return gulp.src([`${pathCss}/*.css`, `!${pathCss}/*.min.css`])
            .pipe(minifyCss())
            .pipe(rename(function (path) {
                path.extname = '.min.css';
            }))
            .pipe(gulp.dest(pathCss));
    });

    gulp.task(`${taskPrefix}build:css`, function () {
        return runSequence(
            `${taskPrefix}clean:css`,
            `${taskPrefix}minify:css`
        );
    });


    /* js */

    gulp.task(`${taskPrefix}clean:js`, function () {
        return del(`${pathJs}/*.min.js`);
    });

    gulp.task(`${taskPrefix}minify:js`, function () {
        return gulp.src([`${pathJs}/*.js`, `!${pathJs}/*.min.js`])
            .pipe(minifyJs())
            .pipe(rename(function (path) {
                path.extname = '.min.js';
            }))
            .pipe(gulp.dest(pathJs));
    });

    gulp.task(`${taskPrefix}build:js`, function () {
        return runSequence(
            `${taskPrefix}clean:js`,
            `${taskPrefix}minify:js`
        );
    });


    /* main build tasks */

    gulp.task(`${taskPrefix}clean`, function () {
        return runSequence(
            `${taskPrefix}clean:images`,
            `${taskPrefix}clean:css`,
            `${taskPrefix}clean:js`
        );
    });

    gulp.task(`${taskPrefix}build`, function () {
        return runSequence(
            `${taskPrefix}build:images`,
            `${taskPrefix}build:css`,
            `${taskPrefix}build:js`,
            `${taskPrefix}build:html`
        );
    });

});

gulp.task('clean:all', ['clean', 'views:clean']);
gulp.task('build:all', ['build', 'views:build']);

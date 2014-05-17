/*-------------------------------------------------------------------
    Required plugins
-------------------------------------------------------------------*/
var    gulp = require('gulp'),
        compass = require('gulp-compass'),
        minifyCss = require('gulp-minify-css'),
        coffee = require('gulp-coffee'),
        uglify = require('gulp-uglify'),
        plumber = require('gulp-plumber'),
        imagemin = require('gulp-imagemin'),
        pngcrush = require('imagemin-pngcrush'),
        livereload = require('gulp-livereload'),
        filter = require('gulp-filter'),
        clean = require('gulp-clean'),
        zip = require('gulp-zip'),
        ftp = require('gulp-ftp'),
        sftp = require('gulp-sftp'),
        useref = require('gulp-useref');

var    jsFilter = filter('**/*.js'),
        cssFilter = filter('**/*.css');

/*-------------------------------------------------------------------
    Configuration
-------------------------------------------------------------------*/
path = {
    app: "app",
    scss: "app/css",
    css: "app/css",
    coffee: "app/js",
    js: "app/js",
    img: "app/img"
}

watched = {
    scss: path.scss + '/**/*.scss',
    coffee: path.coffee + '/**/*.coffee',
    html: path.app + '/**/*.html',
    img: path.img + '/**/*',
    all: path.app + '/**/*.*'
}

deploy = {
    host : "",
    user: "",
    pass: ""
}

/*------DEV TASKS------*/

/*-------------------------------------------------------------------
    Coffee Compilation
-------------------------------------------------------------------*/
gulp.task('coffee', function() {
  return gulp.src(watched.coffee)
            .pipe(plumber())
            .pipe(coffee({bare: true}))
            .pipe(gulp.dest(path.js));
});

/*-------------------------------------------------------------------
    SASS and Compass Compilation
-------------------------------------------------------------------*/
gulp.task('compass', function() {
    return gulp.src(watched.scss)
            .pipe(plumber())
            .pipe(compass({
                css: path.css,
                sass: path.scss,
                image: path.img
            }))
            .pipe(gulp.dest(path.css));
});

/*-------------------------------------------------------------------
    dev
-------------------------------------------------------------------*/
gulp.task('watch', function () {
    var server = livereload();

    gulp.watch(watched.coffee, ['coffee']).on('change', function(e){
        console.log('Your coffee file' + e.path + ' has been compiled');
    });

    gulp.watch(watched.scss, ['compass']).on('change', function(e){
        console.log('Your scss file ' + e.path + ' has been compiled');
    });

    gulp.watch(watched.all).on('change', function(e){
        server.changed(e.path);
    });

});


/*------PROD TASKS------*/

/*-------------------------------------------------------------------
    Optimise images
-------------------------------------------------------------------*/
gulp.task('img', function() {
  return gulp.src(watched.img)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

/*-------------------------------------------------------------------
    Clean dist folder
-------------------------------------------------------------------*/
gulp.task('clean', function() {
  return gulp.src('dist', {read: false}).pipe(clean());
});

/*-------------------------------------------------------------------
    Prod
-------------------------------------------------------------------*/
gulp.task('prod', ['coffee', 'compass', 'clean', 'img'], function () {
    return gulp.src(watched.html)
        .pipe(useref.assets())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(useref.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

/*-------------------------------------------------------------------
    Zip production folder
-------------------------------------------------------------------*/
gulp.task('prod-zip', ['prod'], function () {
    return gulp.src('dist/**/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('.'));
});

/*-------------------------------------------------------------------
    deploy-ftp
-------------------------------------------------------------------*/
gulp.task('deploy-ftp', ['prod'], function () {
    return gulp.src('dist/**/*')
        .pipe(ftp({
            host: deploy.host,
            user: deploy.user,
            pass: deploy.pass
        }));
});

/*-------------------------------------------------------------------
    deploy-sftp
-------------------------------------------------------------------*/
gulp.task('deploy-sftp', ['prod'], function () {
    return gulp.src('dist/**/*')
        .pipe(sftp({
            host: deploy.host,
            user: deploy.user,
            pass: deploy.pass
        }));
});
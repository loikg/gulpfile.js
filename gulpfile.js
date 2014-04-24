/**
*   Mon fichier gulp [24/04/2014]:
**/

/*----------------------------------------------------------------------------
*   Initialisation des plugins utlisés
*---------------------------------------------------------------------------*/
var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    compass = require('gulp-compass'),
    livereload = require('gulp-livereload'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css');

/*----------------------------------------------------------------------------
*   Configuration paths
*---------------------------------------------------------------------------*/
var paths = {
    dev : {
        scss : 'public/dev/css/**/*.scss',
        coffee :'public/dev/js/**/*.coffee',
        img : 'public/dev/img'
    },
    dist : {
        js :'public/assets/js',
        css :'public/assets/css',
        img : 'public/assets/img'
    }
}





/*----------------------------------------------------------------------------
*   Task compilation du coffeeScript
*---------------------------------------------------------------------------*/
gulp.task('coffee', function(){
    return gulp.src('public/dev/js/**/*.coffee')
        .pipe(coffee())
        //.pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('public/assets/js'));
});

/*----------------------------------------------------------------------------
*   Task compilation du js
*---------------------------------------------------------------------------*/
gulp.task('js', function(){
    return gulp.src('public/dev/js/**/*.js')
        .pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('public/assets/js'));
});

/*----------------------------------------------------------------------------
*   Task compilation SASS (scss)
*---------------------------------------------------------------------------*/
gulp.task('compass', function(){
    return gulp.src('public/dev/css/**/*.scss')
        .pipe(compass({
            css : 'public/assets/css/',
            sass : 'public/dev/css/'
        }))
        .pipe(prefix("last 15 version"))
        //.pipe(minifyCSS())
        .pipe(gulp.dest('public/assets/css'));
});




/*----------------------------------------------------------------------------
*   Task Watch
*   - Surveille et compile les coffescript
*   - Surveille et compile les scss
*   - Lance liveReload lors des modifications
*---------------------------------------------------------------------------*/
gulp.task('watch', ['coffee', 'compass'], function(){
    var server = livereload();
    // coffeescript
    gulp.watch(paths.dev.coffee, ['coffee']).on('change', function(event){
        console.log('Fichier ' + event.path + 'a ete modofie');
    });
    // scss
    gulp.watch(paths.dev.scss, ['compass']).on('change', function(event){
        console.log('Fichier ' + event.path + 'a ete modofie');
    });
    // LiveReload
    gulp.watch('./**').on('change', function(file) {
        server.changed(file.path);
        console.log('File change livereload');
    });
});
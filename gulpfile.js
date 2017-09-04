var gulp = require('gulp');
var server = require('gulp-server-livereload');  // сервер
var sass = require('gulp-sass');  // компилирует sass в css
var prefix = require('gulp-autoprefixer');  // проставляет префиксы для кроссбраузерности
var useref = require('gulp-useref');  // парсит специфичные блоки и конкатенирует описанные в них стили и скрипты
var gulpif = require('gulp-if');  // учим uglify разделять css и js
var uglify = require('gulp-uglify');  // будет сжимать наш JS
var csso = require('gulp-csso');  // будет сжимать наш css
var imagemin = require('gulp-imagemin'); // минифицирует картинки
var cleanDest = require('gulp-dest-clean'); // подчищает билд проекта от ненужных файлов
var changed = require('gulp-changed'); // отслеживает изменения в файлах.

//server
gulp.task('start', function() {
  gulp.src('app')  // указываем папку, в которой мы делаем сайт
    .pipe(server({
      livereload: true,  // сразу открываем браузер
      open: true  // поднимаем сервер
    }));
});

//styles
gulp.task('style', function(){
  return gulp.src('app/sass/**/*.sass')  //указывая такой путь, мы говорим плагину компилировать все файлы в папке app/sass
     .pipe(sass().on('error', sass.logError))  // выводим ошибки компиляции в консоль при их возникновении
     .pipe(prefix({
       versions: ['last 50 versions']  // проставляем префиксы для последних 50 версий браузеров
     }))
     .pipe(gulp.dest('app/css'));  //исходящяя папка для css файлов
});

// уменьшаем картинки
gulp.task('images', () =>
    gulp.src('./app/images/**/*') //указывая такой путь, мы говорим плагину компилировать все файлы в папке app/img
    	.pipe(cleanDest('build/images'))
        .pipe(imagemin({
            progressive: true,
			quality: 50,
			smooth: 30
        }))
        .pipe(gulp.dest('build/images')) // папка, в которую будут поступать оптимизированные картинки
);

// переносим шрифты в билд
gulp.task('fonts', () =>
  gulp.src(('./app/fonts/**/*'), ['*.eot','*.svg','*.ttf','*.woff','*.woff2'])
    .pipe(gulp.dest('build/fonts'))
);

//build
gulp.task('build', ['images', 'fonts'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulp.dest('build'));
});

// отслеживаем изменения в sass файлах чтобы сразу компилировать их в css
gulp.task('watch', function(){
  gulp.watch('app/sass/**/*.sass', ['style']);
})

// смотрим за sass файлами, чтобы каждый раз не компилировать в сss все файлы, а только измененные
gulp.task('changed', () =>
    gulp.src('app/sass/**/*.sass')
         .pipe(changed('app/sass', {extension: '.sass'}))
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
);

gulp.task('default', ['start', 'watch', 'changed']);

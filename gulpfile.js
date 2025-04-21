// Основные импорты
const { src, dest, watch, series, task } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const eslint = require('gulp-eslint');
const sync = require('browser-sync').create();

// Конфигурация путей
const PATH = {
  scss: {
    files: 'assets/scss/**/*.scss',
    output: 'assets/css/'
  },
  js: {
    files: 'assets/js/**/*.js',
    filesMin: 'assets/js/**/*.min.js'
  },
  html: '*.html'
};

// SCSS компиляция
function scssCompile() {
  return src(PATH.scss.files)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest(PATH.scss.output))
    .pipe(sync.stream());
}

// Проверка JS
function lintJS() {
  return src([PATH.js.files, `!${PATH.js.filesMin}`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// BrowserSync
function serve() {
  sync.init({
    server: { baseDir: './' },
    notify: false
  });

  watch(PATH.scss.files, series(scssCompile));
  watch([PATH.js.files, `!${PATH.js.filesMin}`], series(lintJS, sync.reload));
  watch(PATH.html).on('change', sync.reload);
}

// Экспорт задач
exports.build = series(scssCompile, lintJS);
exports.serve = serve;
exports.default = serve;
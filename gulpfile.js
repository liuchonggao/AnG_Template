
// generated on 2016-10-24 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

function changePath(basePath){
    var nowCssSrc = [];
    for (var i = 0; i < cssSrc.length; i++) {
        nowCssSrc.push(cssRevSrc + '/' + cssSrc[i]);
    }
    return nowCssSrc;
}

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    //.pipe($.rev())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}))
    //.pipe($.rev.manifest())
    //.pipe(gulp.dest('app/rev/styles'));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    //.pipe($.rev())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}))
    //.pipe($.rev.manifest())
    //.pipe(gulp.dest('app/rev/scripts'));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe($.rev())
    .pipe(gulp.dest('dist'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('app/rev/dist'))
});
gulp.task('rev', () =>{
   gulp.src(['app/rev/**/*.json', 'dist/*.html'])
   .pipe($.revCollector({
            replaceReved: true,
            // dirReplacements: {
            //     './css/': '//static.t.agrantsem.com/',
            //     './js/': '//static.t.agrantsem.com/'
            // }
        }))
   .pipe($.cdn([{
      domain: "styles/",
      cdn: "http://static.t.agrantsem.com/"
    },{
      domain: "scripts/",
      cdn: "http://static.t.agrantsem.com/"
    },{
      domain: "images/",
      cdn: "http://static.t.agrantsem.com/"
    }]))
    .pipe(gulp.dest("dist"));

    gulp.src(['app/rev/**/*.json', 'dist/styles/*'])
    .pipe($.revCollector({
        replaceReved: true,
        // dirReplacements: {
        //     './css/': '//static.t.agrantsem.com/',
        //     './js/': '//static.t.agrantsem.com/'
        // }
    }))
    .pipe($.cdn({
        domain: '../images/',
        cdn: 'http://static.t.agrantsem.com/'
    }))
    .pipe(gulp.dest('dist/styles'));

    gulp.src(['app/rev/**/*.json', 'dist/scripts/*'])
    .pipe($.revCollector({
        replaceReved: true,
        // dirReplacements: {
        //     './css/': '//static.t.agrantsem.com/',
        //     './js/': '//static.t.agrantsem.com/'
        // }
    }))
    .pipe($.cdnRef({
        base: '../images/',
        cdn: 'http://static.t.agrantsem.com/'
    }))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.rev())
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('app/rev/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist', 'app/rev']));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('shell', $.shell.task([
  'echo hello I will start the cdn commit by python',
  'python sync.py ./dist/fonts',
  'python sync.py ./dist/images',
  'python sync.py ./dist/styles',
  'python sync.py ./dist/scripts'
]))

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], (callback) => {
  //gulp.start('build');
  $.runSequence('build','rev','shell');
});

var gulp = require('gulp');
var gutil = require('gulp-util')
var path = require('path');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('gulp-run-sequence');
var shell = require('gulp-shell');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var rename = require("gulp-rename");


/* Set-up environment using $ gulp --type cordova
 * gulp run --type cordova will launch cordova server
 * reachable at: http://10.0.1.175:3131/
 *
 * gulp run will run webpack-dev server with react hot reloads
 * reachable at: http://localhost:3000/webpack-dev-server/build/index.html
 * or http://localhost:3000/build/index.html#/ (for using react-router entry points)
 */
var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var isCordova = environment === 'cordova';

/* Load correct webpack config */
var webpackConfig = isCordova
    ? require('./webpack.cordova.config')
    : require('./webpack.config.js')[environment];

var configs = require('./cordova.config');



var app = 'app/';
var build = 'build/';

var PORT = $.util.env.port || 3000;
var CORDOVA_APP_DIR = configs.targetDirectory;
var CORDOVA_DEVELOPER_APP_PORT = configs.phonegapServePort


gulp.task('webpack-build', function(callback) {
    webpack(webpackConfig).run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();

    })
});

gulp.task('webpack-dev-server', function (callback) {

    new WebpackDevServer(webpack(webpackConfig), {
        publicPath: '/build',
        historyApiFallback: true,
        hot: true,
        stats: {
            colors: true
        }
    }).listen(PORT, 'localhost', function (err) {
            if (err) throw new gutil.PluginError('webpack-dev-server', err);
            gutil.log('[webpack-dev-server]',"http://localhost:3000/webpack-dev-server/build/index.html" )
        });
});

gulp.task('html', function () {
    return gulp.src(isCordova ? app + 'index-cordova.html': app + 'index.html')
        .pipe(rename('index.html'))
        .pipe(isCordova ? gulp.dest(CORDOVA_APP_DIR + '/www/') : gulp.dest(build))
});


gulp.task('cordova-serve', shell.task([
    'phonegap serve --port=' + CORDOVA_DEVELOPER_APP_PORT
], {
    cwd: CORDOVA_APP_DIR
}));

/* Watch for file changes using webpack for cordova server.
 * This will rebuild the .js file and cordova server will auto-reload.
 * For better debug run shell command manually in seperate terminal window
 */
gulp.task('webpack-watch', shell.task([
    'webpack --config webpack.cordova.config.js --watch --display-error-details --colors'

], {
    cwd: __dirname
}));


/* TODO: Create correct/better way to handle images */
//gulp.task('images', function (cb) {
//    return gulp.src(app + 'images/**/*.{png,jpg,jpeg,gif}')
//        .pipe($.size({title: 'images'}))
//        .pipe(gulp.dest(dist + 'images/'));
//});



// by default build project and then watch files in order to trigger livereload
//gulp.task('default', ['build', 'serve', 'watch']);
gulp.task('run', function () {
    isCordova ?
        gulp.start(['webpack-build', 'html', 'webpack-watch', 'cordova-serve']) :
        gulp.start(['webpack-build', 'html', 'webpack-dev-server']);
});


/* Creating the cordova app. Creates the right project dirs and install plugins
 * source: https://github.com/kjda/ReactJs-Phonegap
 */

gulp.task('cordova-create', function (cb) {
    runSequence('clean-app', 'create-app', 'install-plugins', cb);
});

gulp.task('clean-app', function (cb) {
    del(['./' + CORDOVA_APP_DIR], cb);
});

gulp.task('create-app', shell.task([
    'phonegap create ' + CORDOVA_APP_DIR
]));

gulp.task('install-plugins', shell.task(getPhonegapPluginCommands(), {
    cwd: CORDOVA_APP_DIR
}));

gulp.task('copy-config-xml', function () {
    return gulp.src('./src/config.xml')
        .pipe(replace(/{NAMESPACE}/g, configs.app.namespace))
        .pipe(replace(/{VERSION}/g, configs.app.version))
        .pipe(replace(/{APP_NAME}/g, configs.app.name))
        .pipe(replace(/{APP_DESCRIPTION}/g, configs.app.description))
        .pipe(replace(/{AUTHOR_WEBISTE}/g, configs.app.author.website))
        .pipe(replace(/{AUTHOR_EMAIL}/g, configs.app.author.email))
        .pipe(replace(/{AUTHOR_NAME}/g, configs.app.author.name))
        .pipe(replace(/{PLUGINS}/g, getPluginsXML()))
        .pipe(replace(/{ICONS}/g, getIconsXML()))
        .pipe(replace(/{SPLASHSCREENS}/g, getSplashscreenXML()))
        .pipe(replace(/{ACCESS_ORIGIN}/g, configs.app.accessOrigin))
        .pipe(replace(/{ORIENTATION}/g, configs.app.orientation))
        .pipe(replace(/{TARGET_DEVICE}/g, configs.app.targetDevice))
        .pipe(replace(/{EXIT_ON_SUSPEND}/g, configs.app.exitOnSuspend))
        .pipe(gulp.dest('./' + CORDOVA_APP_DIR + '/www/'))
});

function getPhonegapPluginCommands() {
    var commands = [];
    for (var i = 0; i < configs.app.phonegapPlugins.length; i++) {
        var p = configs.app.phonegapPlugins[i];
        commands.push('phonegap plugin add ' + p.installFrom);
    }
    return commands;
}

function getPluginsXML() {
    var xml = '';
    for (var i = 0; i < configs.app.phonegapPlugins.length; i++) {
        var p = configs.app.phonegapPlugins[i];
        var pluginXml = '<gap:plugin name="' + p.name + '"';
        if (!!p.version) {
            pluginXml += ' version="' + p.version + '"';
        }
        pluginXml += '/>' + "\n";
        xml += pluginXml;
    }
    return xml;
}

function getIconsXML() {
    var xml = '';
    for (var i = 0; i < configs.app.icons.length; i++) {
        var e = configs.app.icons[i];
        var eXml = '<icon src="' + e.src + '"';
        if (!!e.platform) {
            eXml += ' platform="' + e.platform + '"';
        }
        if (!!e.width) {
            eXml += ' width="' + e.width + '"';
        }
        if (!!e.height) {
            eXml += ' height="' + e.height + '"';
        }
        if (!!e.density) {
            eXml += ' density="' + e.density + '"';
        }
        eXml += '/>' + "\n";
        xml += eXml;
    }
    return xml;
}

function getSplashscreenXML() {
    var xml = '';
    for (var i = 0; i < configs.app.splashscreens.length; i++) {
        var e = configs.app.splashscreens[i];
        var eXml = '<gap:splash src="' + e.src + '"';
        if (!!e.platform) {
            eXml += ' gap:platform="' + e.platform + '"';
        }
        if (!!e.width) {
            eXml += ' width="' + e.width + '"';
        }
        if (!!e.height) {
            eXml += ' height="' + e.height + '"';
        }
        eXml += '/>' + "\n";
        xml += eXml;
    }
    return xml;
}
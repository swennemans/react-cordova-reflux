var cordovaConfig = require('./cordova.config');
var webpack = require('webpack');

var entry = [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './app/scripts/main.js'
    ],
    output = {
        path: __dirname + '/build/',
        filename: 'build.js'
    };


module.exports.development = {
    debug: true,
    devtool: 'eval',
    entry: entry,
    output: output,
    module: {
        loaders: [
            {test: /\.jsx?$/, loaders: ['react-hot', 'babel-loader'], exclude: /node_modules/},
            //{test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]

};

module.exports.production = {
    debug: false,
    entry: entry,
    output: output,
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
            //{test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.styl$/, loader: "style-loader!stylus-loader"},
        ]
    }
};

module.exports.cordova = {
    debug: true,
    devtool: 'eval',
    watch: true,
    entry: './app/scripts/main.js',
    output: {
        path: __dirname + '/' + cordovaConfig.targetDirectory + '/www/js',
        filename: 'build.js'
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
            //{test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
        ]
    }
};

const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: '[name].bundle.js',
        path: DIST_DIR + "/app",
        publicPath: "/app/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: SRC_DIR,
                loader: "babel-loader",
                query: {
                    presets: ["react", "es2015", "stage-2"]
                },
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        overlay: true,
        hot: true
    },
    plugins: [
        new CopyWebpackPlugin(['index.html']),
        new webpack.HotModuleReplacementPlugin()
    ]
};
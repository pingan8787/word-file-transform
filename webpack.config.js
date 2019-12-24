const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const outputName = "word-file-transform.umd.js";
module.exports = {
    entry: ['babel-polyfill','./src/index.js'],
    // mode: 'development',
    mode: 'production',
    output: {
        filename: outputName,
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
      alias: {
        '@config' : path.resolve(__dirname, './src/config'),
        '@utils' : path.resolve(__dirname, './src/utils')
      }
    },
    performance: {
        hints:false   
    },
    module:{
        rules: [
          {
            test: /\.js$/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }],
            exclude: /(node_modules|bower_components)/,
          }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new UglifyJsPlugin({
          cache: true, parallel: true, sourceMap: false,
          uglifyOptions: {
              compress: {
                  pure_funcs:['console.log'],
                  drop_console: true,
                  drop_debugger: true,
                  unused: false,
              }
          }
        }),
        new BundleAnalyzerPlugin()
    ],
}
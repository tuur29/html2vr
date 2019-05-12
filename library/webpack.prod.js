/* eslint-disable import/no-extraneous-dependencies */

const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.IgnorePlugin(/aframe/),
    { // copy library to extension folder
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
          fs.copyFile('./dist/html2vr.min.js', '../extension/lib/html2vr.min.js', (err) => {
            if (err) throw err;
            console.log('Build was copied to extension folder!');
          });
        });
      },
    },
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
});

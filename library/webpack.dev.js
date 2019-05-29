/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      ENV: {
        DEV: true,
        PORT: 8080,
      },
    }),
  ],
  devServer: {
    inline: false,
    open: false,
    host: '0.0.0.0',
    contentBase: [
      './dist',
      '../demo/site',
      './node_modules/aframe/dist',
      './node_modules/aframe-extras/dist',
      './node_modules/super-hands/dist',
    ],
    port: 8080,
    proxy: {
      '/library/dist': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/library/dist': '' },
      },
    },
  },
});

/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: false,
    contentBase: [
      './dist',
      '../demo/site',
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

/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    inline: false,
    open: false,
    host: '0.0.0.0',
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

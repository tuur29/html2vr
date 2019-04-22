/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');

// TODO: don't allow in nodejs
module.exports = {
  entry: {
    html2vr: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'html2vr.min.js',
    library: 'html2vr',
    // TODO: what is libraryTarget exactly?
    libraryTarget: 'var',
  },
};

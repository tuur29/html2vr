/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// TODO: don't allow in nodejs
module.exports = {
  entry: {
    html2vr: './src/index.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
    library: '[name]',
    // TODO: what is libraryTarget exactly?
    libraryTarget: 'var',
  },
};

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const HOST = 'localhost';
const PORT = process.env.PORT || '4000';


module.exports = merge(common, {
  devtool: 'eval-source-map',

  devServer: {
    contentBase: './dist',
    host: HOST,
    port: PORT,
    historyApiFallback: true,
    hot: true,
    inline: true,
    clientLogLevel: 'none',
    stats: 'errors-only',
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
  ],
});

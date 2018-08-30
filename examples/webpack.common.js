const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, './src/index.tsx'),
  ],

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist/'),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // include: path.join(__dirname, '../src/'), // point to examples and src?
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          { loader: 'css-loader' }, // translates CSS into CommonJS
          { loader: 'sass-loader' }, // compiles Sass to CSS
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
  },
};

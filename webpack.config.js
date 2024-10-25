const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      scriptLoading: 'blocking',
      inject: 'head',
      template: path.resolve(__dirname, 'public', 'index.html'),
      // favicon: path.resolve(__dirname, 'public', 'favicon.svg'),
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, 'public', 'favicon.svg')),
    new MiniCssExtractPlugin(),
  ],
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
devServer: {
  port: 8080,
  proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  {
    context: ['/uploads'],
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
],
},
};
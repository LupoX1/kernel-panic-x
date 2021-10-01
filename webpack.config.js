const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode : 'development',
  entry: {
      index : './src/index.js',
},
devtool : 'inline-source-map',
devServer : {
  static: './dist',
},
plugins:[
    new HtmlWebpackPlugin({
      template : './src/index.html',
    }),
    new MiniCssExtractPlugin({ filename: './src/style.css' }),
],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, './dist'),
    clean : true,
  },
  optimization : {
    moduleIds: 'deterministic',
    runtimeChunk : 'single',
    splitChunks : {
      cacheGroups : {
        vendor : {
          test : /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks : 'all',
        },
      },
    },
  },
  module : {
      rules : [
        {
          test: /\.js$/,
          include : path.resolve(__dirname, 'src'),
          loader : 'babel-loader',
        },
        {
          test: /\.css$/,
          use : [MiniCssExtractPlugin.loader, "css-loader"],
        },
         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource'
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource'
        }
      ]
  }
}
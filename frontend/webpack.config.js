// const path = require('path');
// // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// module.exports
export default {
  entry: './src/main.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader',
              'css-loader',
              {
                loader: 'postcss-loader', // Processes CSS with PostCSS
                options: {
                  postcssOptions: {
                    plugins: [
                      // require('tailwindcss'), // Include Tailwind
                      // require('autoprefixer'), // Include Autoprefixer
                    ],
                  },
                },
              },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true
 }
};

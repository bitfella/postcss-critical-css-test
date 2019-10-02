'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostcssImport = require('postcss-import');
const PostcssPresetEnv = require('postcss-preset-env');
const PostcssCriticalCss = require('postcss-critical-css');

module.exports = () => {
  return {
    entry: path.join(__dirname, 'src', 'main.js'),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `[name].js`,
      chunkFilename: `chunks/[name].js`
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              'presets': [
                ['@babel/preset-env', {
                  'useBuiltIns': 'usage',
                  'corejs': '2',
                  'targets': {
                    'browsers': [
                      'last 2 versions',
                      'ie >= 11'
                    ]
                  }
                }]
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import']
            }
          }
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  PostcssImport(),
                  PostcssPresetEnv({
                    browsers: 'last 2 versions',
                    autoprefixer: {
                      grid: 'autoplace'
                    }
                  }),
                  PostcssCriticalCss({
                    outputPath: 'critical',
                    outputDest: 'critical.css',
                    preserve: false
                  })
                ]
              }
            },
            { loader: 'sass-loader' }
          ],
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].css`,
        chunkFilename: `chunks/[name].css`
      })
    ]
  }
}
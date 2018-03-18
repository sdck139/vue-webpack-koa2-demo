'use strict'

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const pkg = require('../package.json')
const extractCss = new ExtractTextPlugin('main.[contenthash:8].css')

const originalConfig = {

  context: path.join(__dirname, '../frontend'),

  entry: {
    'home': './entry.js',
    vendor: ['vue', 'vue-router', 'mint-ui', 'vuex', 'axios', 'lodash']
  },

  output: {
    path: path.join(__dirname, '../dist/' + pkg.name + '/frontend'),
    publicPath: '/',
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.common.js'
    }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '../frontend/scripts/yzl-jsapi.js')
        ],
        use: {
          loader: 'eslint-loader',
          options: {
            configFile: 'frontend/.eslintrc.js'
          }
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.styl$/,
        use: extractCss.extract(['css-loader', 'stylus-loader'])
      },
      {
        test: /\.css$/,
        use: extractCss.extract(['css-loader'])
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|ico)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'asset/[name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name].[hash:8].[ext]'
          }
        },
        exclude: /assets[\\/]+?icons[\\/]+?/
      },
      {
        test: /assets[\\/]+?icons[\\/]+?\S+\.svg$/,
        use: ['raw-loader', {
          loader: 'svgo-loader',
          options: {
            plugins: [
              {cleanupAttrs: true},
              {removeDoctype: true},
              {removeComments: true},
              {removeTitle: true},
              {removeDesc: true},
              {removeUselessDefs: false},
              {convertColors: { shorthex: false }},
              {convertPathData: true},
              {mergePaths: true},
              {convertShapeToPath: true},
              {sortAttrs: true},
              {removeStyleElement: true},
              {removeAttrs: true}
            ]
          }
        }]
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),

    extractCss
  ]
}

module.exports = originalConfig

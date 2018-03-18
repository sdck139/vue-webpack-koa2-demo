'use strict'

const _ = require('lodash')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const base = require('./webpack.base')
const buildConfig = require('./config')

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.HashedModuleIdsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new CopyPlugin([
    {
      from: 'assets/*',
      to: 'assets/[name].[ext]'
    }
  ]),
  new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      discardComments: {
        removeAll: true
      }
    },
    canPrint: true
  })
]

_.each(buildConfig.page, (v, k) => {
  plugins.push(new HTMLPlugin({
    title: v.title,
    filename: k + '.html',
    template: './index.html',
    chunks: ['manifest', 'vendor', k],
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  }))
})

const config = merge(base, {
  output: {
    filename: '[name].[chunkhash:8].js'
  },
  plugins
})

module.exports = config

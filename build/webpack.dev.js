'use strict'

const _ = require('lodash')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')

const base = require('./webpack.base')
const buildConfig = require('./config')

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]

_.each(buildConfig.page, (v, k) => {
  plugins.push(new HTMLPlugin({
    title: v.title,
    filename: k + '.html',
    template: './index.html',
    chunks: ['manifest', 'vendor', k]
  }))
})

const config = merge(base, { plugins })

config.entry.vendor.push('webpack-hot-middleware/client')

module.exports = config

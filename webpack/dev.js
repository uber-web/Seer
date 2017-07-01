// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import webpack from 'webpack'
import { resolve } from 'path'

import webpackConfig from './base'

const src = resolve(__dirname, '../src')

export default {
  ...webpackConfig,

  entry: ['./src/dev/main'],

  devtool: 'inline-source-map',

  resolve: {
    alias: {
      'mapbox-gl/js/geo/transform': resolve(__dirname, '../node_modules/mapbox-gl/js/geo/transform'),
      'mapbox-gl': resolve(__dirname, '../node_modules/mapbox-gl/dist/mapbox-gl.js'),
      react: resolve(__dirname, '../node_modules/react'),
    },
  },

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: src,
      query: { presets: ['react-hmre'] },
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader', 'autoprefixer-loader'],
      include: src,
    }],
  },

  plugins: [
    ...webpackConfig.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN || ''),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  node: {
    fs: 'empty',
  },

}

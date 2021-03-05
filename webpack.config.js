const path = require('path')
const env = require('./config/env')
const loaders = require('./config/webpack.loaders')
const plugins = require('./config/webpack.plugins')
const optimization = require('./config/webpack.optimization')
const { eleventyOptions, customOptions } = require('./config/eleventy.config')
const dir = eleventyOptions.dir
const customDir = customOptions.dir
const entryBaseName = customOptions.entry.basename

module.exports = {
  mode: env.isDev ? 'development' : 'production',
  entry: {
    [entryBaseName]: path.resolve(
      __dirname,
      customDir.src,
      customDir.assets,
      customDir.js,
      `${entryBaseName}.js`
    ),
  },
  output: {
    filename: env.isDev ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, dir.output, customDir.assets),
  },
  // devtool: env.isDev ? 'inline-source-map' : false,
  devtool: env.isDev ? 'cheap-source-map' : false,
  module: {
    rules: loaders,
  },
  plugins,
  optimization,
  stats: {
    assets: true,
    warnings: true,
    ...(env.isDev
      ? {
          children: false,
          chunks: false,
          hash: false,
          modules: false,
          publicPath: false,
          timings: false,
          version: false,
        }
      : ''),
    colors: {
      green: '\u001b[32m',
    },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
}

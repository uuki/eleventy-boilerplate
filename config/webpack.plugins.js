const env = require('./env')
const cssnano = require('cssnano')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default
const ManifestPlugin = require('webpack-manifest-plugin')
const { customOptions } = require('./eleventy.config')
const entryCssBaseName = customOptions.entry.css

// Optimize CSS assets
const optimizeCss = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: cssnano,
  cssProcessorPluginOptions: {
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  },
  canPrint: true,
})

// Stylelint
const stylelint = new StyleLintPlugin()

// Extract CSS
const cssExtract = new MiniCssExtractPlugin({
  filename: env.isDev
    ? `${entryCssBaseName}.css`
    : `${entryCssBaseName}.[contenthash].css`,
  chunkFilename: '[id].css',
  // publicPath: path.join(),
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        minimize: !env.isDev,
        sourceMap: env.isDev,
      },
    },
  ],
})

const license = new LicenseInfoWebpackPlugin({
  glob: '{LICENSE,license,License}*',
})

const manifestPlugin = new ManifestPlugin({
  publicPath: '/assets/',
})

module.exports = [
  stylelint,
  cssExtract,
  env.isDev === 'production' && optimizeCss,
  env.isDev === 'production' && license,
  manifestPlugin,
].filter(Boolean)

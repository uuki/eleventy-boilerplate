const env = require('./env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const sourceMap = env.isDev

// Javascript loaders
const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
    },
    'eslint-loader',
  ],
}

// Style loaders
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap,
    importLoaders: 1,
  },
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap,
    postcssOptions: {
      plugins: (loader) => [
        require('postcss-import')({ root: loader.resourcePath }),
        require('postcss-normalize')(),
        require('autoprefixer')({ grid: true }),
      ],
    },
  },
}

const sassPre = {
  test: /\.s[c|a]ss$/,
  enforce: 'pre',
  loader: 'import-glob-loader',
}

const sass = {
  test: /\.s[c|a]ss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    cssLoader,
    postcssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap,
      },
    },
  ],
}

module.exports = [js, sassPre, sass]

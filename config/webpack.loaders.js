const env = require('./env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const sourceMap = env.isDev
const { customOptions } = require('./eleventy.config')
const dir = customOptions.dir

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

// Image loaders
const imageLoader = {
  loader: 'image-webpack-loader',
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
    mozjpeg: {
      progressive: true,
    },
    webp: {
      quality: 75,
    },
  },
}

const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  exclude: /fonts/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
        outputPath: (url, resourcePath, context) => {
          return url.replace(`${dir.src}/${dir.assets}/`, '')
        },
      },
    },
    env.isDev ? imageLoader : null,
  ].filter(Boolean),
}

module.exports = [js, sassPre, sass, images]

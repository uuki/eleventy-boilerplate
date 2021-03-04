const fs = require('fs')
const path = require('path')
const env = require('./env')
const manifestPath = path.join(
  process.env.PWD,
  'dist',
  'assets',
  'manifest.json'
)
const entryBaseName = 'app'

const eleventyOptions = {
  dir: {
    input: 'src/views/pages',
    output: 'dist',
    // ⚠️ These values are both relative to your input directory.
    data: '../data',
    layouts: '../layouts',
    includes: '../includes',
  },
  htmlTemplateEngine: 'hbs',
  passthroughFileCopy: true,
}

const customOptions = {
  dir: {
    src: 'src',
    assets: 'assets',
    images: 'img',
    js: 'js',
    css: 'styles',
    static: 'static',
  },
  entry: {
    basename: entryBaseName,
    css: 'style',
  },
  copy: {
    'src/assets/img': 'assets/img',
    'src/assets/fonts': 'assets/fonts',
    'src/static': '/',
  },
  manifest: {
    path: manifestPath,
    ...(env.isDev
      ? {
          [`${entryBaseName}.js`]: '/assets/app.js',
          [`${entryBaseName}.css`]: '/assets/style.css',
        }
      : JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }))),
  },
  shortcode: {
    image: {
      useNativeLazy: true,
    },
  },
  plugin: {
    eleventyImg: (context = {}) => {
      const { src } = context
      const dirName = path.dirname(src || '').replace('.', '')

      return {
        widths: context.widths || [null],
        formats: ['webp', null],
        urlPath: `/dist/assets/img/${dirName}`,
        outputDir: `./dist/assets/img/${dirName}`,
        useCache: true,
        filenameFormat: function (id, src, width, format, options) {
          const extension = path.extname(src)
          const basename = path.basename(src, extension)
          return `${basename}.${format}`
        },
      }
    },
  },
}

module.exports = {
  env,
  eleventyOptions,
  customOptions,
  manifestPath,
}

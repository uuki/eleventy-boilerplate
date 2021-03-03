const yaml = require('js-yaml')
const handlebarsHelpers = require('handlebars-helpers')()
const { htmlmin } = require('./config/eleventy.transform')
const {
  eleventyOptions,
  customOptions,
} = require('./config/eleventy.config')
const {
  bundledResourceHintsShortCode,
  bundledCssShortCode,
  bundledJsShortCode,
  imageShortCode,
} = require('./config/eleventy.shortcode')

module.exports = function(config) {
  // Data Extension
  // -> Yaml
  config
    .addDataExtension('yaml', (contents) => yaml.load(contents))

  // PassthroughCopy
  // -> media resources
  // https://www.11ty.dev/docs/copy/
  config
    .addPassthroughCopy(customOptions.copy)

  // Handlebars Helpers
  // -> Install all helper
  Object.keys(handlebarsHelpers).forEach((name) => {
    config
      .addHandlebarsHelper(name, handlebarsHelpers[name])
  })

  // Layout Alias
  config
    .addLayoutAlias('default', 'default.hbs')

  // Transforms
  // -> HTML
  config
    .addTransform('htmlmin', htmlmin)

  // ShortCode
  // -> Image
  config.addHandlebarsShortcode('Image', imageShortCode)
  // -> Resouce Hints
  config
    .addHandlebarsShortcode('bundledResourceHints', bundledResourceHintsShortCode)
  // -> bundled CSS
  config
    .addHandlebarsShortcode('bundledCss', bundledCssShortCode)
  // -> bundled JS.
  config
    .addHandlebarsShortcode('bundledJs', bundledJsShortCode)

  // Reload the page every time any JS/CSS files are changed.
  config
    .setBrowserSyncConfig({ files: [customOptions.manifest.path] });

  // Eleventy Config
  return eleventyOptions
}
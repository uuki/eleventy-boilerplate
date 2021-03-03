const pluginHtmlmin = require('html-minifier')

function htmlmin(content, outputPath) {
  if (outputPath.endsWith('.html')) {
    const minified = pluginHtmlmin.minify(content, {
      collapseWhitespace: true,
      minifyCSS: true,
      removeComments: true,
    })
    return minified
  }
  return content
}

module.exports = {
  htmlmin,
}

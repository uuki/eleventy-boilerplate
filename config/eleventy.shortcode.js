const path = require('path')
const Image = require('@11ty/eleventy-img')
// const sharp = require('sharp')
const { eleventyOptions, customOptions } = require('./eleventy.config')
const customDir = customOptions.dir
const manifest = customOptions.manifest
const entryBaseName = customOptions.entry.basename
const manifestCss = manifest[`${entryBaseName}.css`]
const manifestJs = manifest[`${entryBaseName}.js`]

/**
 * bundledResourceHintShortCode
 * @doc webpackで出力したリソース用のHintsを読み込む
 */
function bundledResourceHintsShortCode() {
  const metadata = Object.keys(manifest).reduce((acc, entry) => {
    const url = manifest[entry]
    const format = path.extname(url).replace('.', '')
    const type = {
      js: 'script',
      css: 'style',
    }[format]

    acc.push(`<link rel="preload" href="${url}" as="${type}">`)
    return acc
  }, [])

  return metadata.join('\n')
}

/**
 * bundledCssShortCode
 * @doc webpackで出力したcssを読み込む
 */
function bundledCssShortCode() {
  return manifestCss ? `<link href="${manifestCss}" rel="stylesheet">` : ''
}

/**
 * bundledJsShortCode
 * @doc webpackで出力したjsを読み込む
 */
function bundledJsShortCode() {
  return manifestJs ? `<script src="${manifestJs}" defer></script>` : ''
}

// /**
//  * base64ShortCode
//  * @doc ソースをbase64に変換して返却
//  * @param {string} src // e.g.
//  */
// async function base64ShortCode(src) {
//   const result = await sharp(src)
//     .resize({ fit: sharp.fit.inside })
//     .blur()
//     .toBuffer()

//   return result
// }

const generateImage = async (src, alt) => {
  if (!src || !alt) {
    throw new Error(`Missing \`src\` or \`alt\` on myImage from: ${src}`)
  }

  Image.concurrency = 10
  const options = customOptions.plugin.eleventyImg()
  const resolveSrcPath = path.join(
    customDir.src,
    customDir.assets,
    customDir.images,
    src
  )

  // 画像処理
  await Image(resolveSrcPath, options)
}

/**
 * imageShortCode
 * @doc 画像処理のショートコード
 * @param {string} src // e.g. path/to/img/<src>.<ext>
 * @param {string} alt
 */
function imageShortCode(src, alt) {
  const options = customOptions.plugin.eleventyImg()
  const useNativeLazy = customOptions.shortcode.image.useNativeLazy
  const outputPath = `/${eleventyOptions.dir.output}`
  const optimizedImagePath = (
    options.urlPath + src.replace(path.extname(src), '.webp')
  ).replace(outputPath, '')
  const fallbackImagePath = (options.urlPath + src).replace(outputPath, '')
  const source = `<source
    type='image/webp'
    ${useNativeLazy ? '' : 'data-'}srcset='${optimizedImagePath}'
  >`
  const img = `<img
    src='${useNativeLazy ? `${fallbackImagePath}` : ''}'
    alt='${alt}'
    ${useNativeLazy ? '' : `data-srcset='${fallbackImagePath}'`}
    ${useNativeLazy ? `decoding='async'` : ''}>`

  // 画像を生成
  generateImage(src, alt)

  // // プレースホルダー画像作成
  // const placeholder = await base64ShortCode(srcset['fallback'].outputPath)

  return `<picture>
    ${source}
    ${img}
  </picture>`
}

module.exports = {
  bundledResourceHintsShortCode,
  bundledCssShortCode,
  bundledJsShortCode,
  imageShortCode,
}

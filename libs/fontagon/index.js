const path = require('path')
const glob = require('glob')
const fs = require('fs')
const Fontagon = require('fontagon')
const { customOptions } = require('../../config/eleventy.config')
const cyan = '\u001b[36m'
const reset = '\u001b[0m'

let ROOT = process.env.PWD
if (!ROOT) {
  ROOT = process.cwd()
}

const entry = glob.sync(
  path.join(
    ROOT,
    customOptions.dir.src,
    customOptions.dir.assets,
    'icons',
    '*.svg'
  )
)
const publishPath = path.join(
  ROOT,
  customOptions.dir.src,
  customOptions.dir.assets,
  'fonts'
)
const fontName = 'fontagon-icons'
const options = {
  files: [...entry],
  dist: publishPath,
  fontName,
  // https://developer.mozilla.org/ja/docs/Web/Guide/WOFF
  order: ['woff2', 'woff'],
}

const defaultOption = {
  files: [],
  dist: '',
  fontName: 'fontagon-icons',
  style: 'sass',
  classOptions: {
    baseClass: 'fontagon-icons',
    classPrefix: 'ft',
  },
}

const generateFont = async () => {
  if (!entry.length) return

  console.log(
    `📚 These files are included in the entry.\n---\n${cyan}${entry.join(
      '\n'
    )}${reset}\n---\n`
  )
  await Fontagon({ ...defaultOption, ...options })

  fs.readFile(
    path.join(publishPath, `${fontName}.sass`),
    'utf8',
    (err, data) => {
      data = data.replace(/url\("/g, 'url("../fonts/')

      fs.writeFile(
        path.join(publishPath, `${fontName}.sass`),
        data,
        'utf8',
        (err) => {
          console.error(err)
        }
      )
    }
  )
}

try {
  generateFont()
} catch (err) {
  console.error('Generate Error: ', err)
}

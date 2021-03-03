const env = require('./config/env')

module.exports = {
  plugins: [
    require('autoprefixer')({
      cascade: false,
    }),
    ...(env.isDev
      ? ''
      : require('cssnano')({
          preset: 'default',
        })),
  ],
}

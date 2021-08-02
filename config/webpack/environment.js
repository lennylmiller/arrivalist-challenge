const {environment} = require('@rails/webpacker')
const {resolve} = require('path')

const basePath = 'app/javascript'

// Enable the default config
environment.config.merge({
  resolve: {
    alias: {
      '@arrivalist/api': resolve(basePath, 'api/'),
      '@arrivalist/common': resolve(basePath, 'components/common/'),
      '@arrivalist/components': resolve(basePath, 'components/'),
      '@arrivalist/stores': resolve(basePath, 'stores/'),
      '@arrivalist/utils': resolve(basePath, `utils/`)
    },
  },
})
module.exports = environment

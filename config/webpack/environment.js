const {environment} = require('@rails/webpacker')
const {resolve} = require('path')

const basePath = 'app/javascript'

// Enable the default config
environment.config.merge({
  resolve: {
    alias: {
      '@geezeo/api': resolve(basePath, 'api/'),
      '@geezeo/common': resolve(basePath, 'components/common/'),
      '@geezeo/components': resolve(basePath, 'components/'),
      '@geezeo/stores': resolve(basePath, 'stores/'),
      '@geezeo/utils': resolve(basePath, `utils/`)
    },
  },
})
module.exports = environment

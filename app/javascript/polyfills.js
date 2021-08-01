import 'core-js/features/array/fill'
import 'core-js/features/array/find'
import 'core-js/features/array/from'
import 'core-js/features/array/includes'
import 'core-js/features/array/find-index'
import 'core-js/es/number'
import 'core-js/es/object'
import 'core-js/es/string'
import 'core-js/es/array'
import 'core-js/es/symbol'
import 'core-js/es/map'
import 'core-js/es/set'
import 'core-js/features/symbol/iterator'
import 'innersvg-polyfill'
import 'inert-polyfill'
import 'iframe-resizer/js/iframeResizer.contentWindow.js'

if (!window.Promise) {
  require('core-js/features/promise')
}

import { EventEmitter } from 'events'
import { assign } from 'es6-object-assign'
import { action, observable, computed } from 'mobx'
import deepmerge from 'deepmerge'
import { scaleOrdinal } from 'd3-scale'
import { darken, lighten } from '@material-ui/core/styles/colorManipulator'
import { isFunction, isNumber } from '@geezeo/utils/types'
import defaults from './defaults.json'

let rootContextStore
const snackbarVisible = observable.box(false)
let initialRoute = null

// responsible for context specific configuration, events & error handling
class ContextStore {

  transforms = {
    fontFamily          : (config, value) => config.typography.fontFamily = value,
    headerColor         : (config, value) => config.palette.custom.header = value,
    primaryColor        : (config, value) => config.palette.primary.main = value,
    primaryTextColor    : (config, value) => config.palette.primary.contrastText = value,
    primaryLightColor   : (config, value) => config.palette.primary.light = value,
    primaryDarkColor    : (config, value) => config.palette.primary.dark = value,
    secondaryColor      : (config, value) => config.palette.secondary.main = value,
    secondaryTextColor  : (config, value) => config.palette.secondary.contrastText = value,
    secondaryLightColor : (config, value) => config.palette.secondary.light = value,
    secondaryDarkColor  : (config, value) => config.palette.secondary.dark = value,
    tagColor            : (config, value) => config.palette.custom.tag = value,
    tagTextColor        : (config, value) => config.palette.custom.tagText = value
  }

  @observable displayError = false
  @observable errorInfo
  @observable width
  @observable height
  @observable iframePageInfo
  @observable offsetTop
  @observable scrollTop
  @observable iframeHeight
  @observable fullScreenDialog = false
  @observable closeButtonVisible
  @observable hasFab = false
  @observable termsAccepted = false
  @observable currentRoute
  @observable contentHeight
  @observable _headerRef
  @observable hasIFrame = false
  @observable showMessageDialog = false

  events = new EventEmitter()
  on   = this.events.on
  emit = this.events.emit
  config = {}
  colors = scaleOrdinal()

  @computed get initialRoute() {
    return initialRoute
  }

  @computed get showBackButton() {
    const isInitial = initialRoute === this.currentRoute
    const isTopLevel = this.config.topLevelRoutes.includes(this.currentRoute)
    const { includeNav } = this.theme.header
    const { disableBackOnTopLevelRoutes } = this.config

    if (!disableBackOnTopLevelRoutes && !includeNav) {
      return !isInitial
    }

    if (disableBackOnTopLevelRoutes && !includeNav) {
      return !isTopLevel
    }

    return !isInitial && !isTopLevel
  }

  @computed get showLogout() {
    return this.config.showLogout
  }

  @computed get snackbarVisible() {
    return snackbarVisible.get() && !this.config.hideNotificationsSnackbar
  }

  @computed get viewTop() {
    if (isNumber(this.scrollTop)) {
      return this.scrollTop < this.offsetTop ? 0 : this.scrollTop - this.offsetTop
    }
    return -1
  }

  @computed get viewHeight() {
    if (isNumber(this.scrollTop)) {
      // amount of space above the iframe visable in the viewport
      const topSpace = Math.max(this.offsetTop - this.scrollTop, 0)
      // amount of space below the iframe visable in the viewport
      const bottomSpace = Math.max((this.scrollTop + this.height) - (this.iframeHeight + this.offsetTop), 0)
      return this.height - topSpace - bottomSpace
    }
    return -1
  }

  @computed get headerHeight() {
    return this._headerRef?.current?.clientHeight
      ? this._headerRef?.current?.clientHeight
      : 0
  }

  @computed get gzoContent() {
    return this.ref.querySelector('#gzocontent')
  }

  constructor(...parents) {
    assign(this, this.transformValues(deepmerge.all([...parents], {
      arrayMerge: (destinationArray, sourceArray, options) => sourceArray
    })))
    this.colors
      .range(this.config.palette.custom.donut)
    this.closeButtonVisible = this.config.showCloseButton
  }

  onGlobal = (...args) => {
    if (this === rootContextStore) {
      this.on(...args)
    } else {
      rootContextStore.on(...args)
    }
  }

  emitGlobal = (type, ...args) => {
    if (this === rootContextStore) {
      this.emit(type, ...args)
    } else {
      rootContextStore.emit(type, ...args)
    }
  }

  merge = values => {
    return new ContextStore(this, values)
  }

  transformValues = values => {
    if (values && values.config) {
      const { config } = values
      Object
        .keys(this.transforms)
        .forEach(key => {
          if (config[key]) {
            this.transforms[key](config, config[key])
            delete config[key]
          }
        })
      const { palette, donutSaturation } = config
      if (donutSaturation) {
        const donut = []
        for (let i = -4; i <= 4; i++) {
          if (i < 0) {
            donut.push(lighten(palette.primary.main, Math.abs(i * donutSaturation)))
          } else if (i > 0) {
            donut.push(darken(palette.primary.main, i * donutSaturation))
          } else {
            donut.push(palette.primary.main)
          }
        }
        palette.custom.donut = donut
      }
      // add new alternate
      palette.primary.darker = darken(palette.primary.main, 0.15)
      palette.primary.ligher = lighten(palette.primary.main, 0.15)
    }
    return values
  }

  @action logout() {
    const {
      logoutUrl,
      onlineBankingUrl
    } = this.config
    if (logoutUrl === 'window.close()') {
      window.close()
    } else {
      document.location = logoutUrl || onlineBankingUrl
    }
  }

  @action setSnackbarVisible = value => {
    snackbarVisible.set(value)
  }

  @action handleRejection = e => {
    this.handleError(e)
  }

  @action handleError = (e, opts = {}) => {
    // log to console
    console.error('handleError called', { e, opts })


    // notify partner
    let handler
    if (e.noTransactions || e.noAccounts) {
      handler = this.noDataHandler || this.errorHandler
    } else if (e.invalidUser) {
      handler = this.invalidUserHandler || this.errorHandler
    } else {
      handler = this.errorHandler
      // only capture exceptions for issues other than noTransactions, noAccounts, or invalidUser issues
    }

    // display error
    // the handler could be a function or an image url
    this.errorInfo = {
      returnValue: isFunction(handler) ? handler(e) : handler,
      error: e
    }
    this.displayError = true
  }

  @action setRef = ref => {
    this.ref = ref
    if (ref) {
      this.handleResize()
    }
  }

  @action handleResize = () => {
    if (this.ref) {
      this.width = this.ref.offsetWidth
    }
    if ('parentIFrame' in window) {
      window.parentIFrame.getPageInfo(this.setParentPageInfo)
    } else {
      this.height =  window.innerHeight
    }
    this.contentHeight = this.height - this.headerHeight
  }

  @action setParentPageInfo = iframePageInfo => {
    this.height = iframePageInfo.clientHeight || window.innerHeight
    this.scrollTop = iframePageInfo.scrollTop
    this.offsetTop = iframePageInfo.offsetTop
    this.iframeHeight = iframePageInfo.iframeHeight
    this.iframePageInfo = iframePageInfo
    this.hasIFrame = true
  }

  @action showCloseButton = () => {
    this.closeButtonVisible = true
  }

  @action hideCloseButton = () => {
    this.closeButtonVisible = false
  }

  setErrorHandler(handler) {
    this.errorHandler = handler
  }

  setNoDataHandler(handler) {
    this.noDataHandler = handler
  }

  setNoAdHandler(handler) {
    this.noAdHandler = handler
  }

  @action clearFabButton() {
    this.hasFab = false
  }


  @action setCurrentRoute(pathname) {
    this.currentRoute = pathname
  }

  @action setResizeListener = () => {
    global.addEventListener('resize', this.handleResize)
  }

  @action removeResizeListener = () => {
    global.removeEventListener('resize', this.handleResize)
  }

  @action setHeaderRef = ref => {
    this._headerRef = ref
  }

  @action setShowMessageDialog = showDialog => {
    this.showMessageDialog = showDialog
  }
}

rootContextStore = new ContextStore(defaults)
export default rootContextStore

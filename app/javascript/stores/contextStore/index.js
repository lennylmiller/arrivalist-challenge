import {EventEmitter} from 'events'
import {assign} from 'es6-object-assign'
import {action, observable} from 'mobx'
import deepmerge from 'deepmerge'
import {scaleOrdinal} from 'd3'
import {darken, lighten} from '@material-ui/core/styles/colorManipulator'
import {isFunction} from '@arrivalist/utils/types'
import defaults from './defaults.json'

let rootContextStore

// A Global store responsible for context specific configuration, events & error handling
class ContextStore {

  // Themeing
  transforms = {
    fontFamily: (config, value) => config.typography.fontFamily = value,
    headerColor: (config, value) => config.palette.custom.header = value,
    primaryColor: (config, value) => config.palette.primary.main = value,
    primaryTextColor: (config, value) => config.palette.primary.contrastText = value,
    primaryLightColor: (config, value) => config.palette.primary.light = value,
    primaryDarkColor: (config, value) => config.palette.primary.dark = value,
    secondaryColor: (config, value) => config.palette.secondary.main = value,
    secondaryTextColor: (config, value) => config.palette.secondary.contrastText = value,
    secondaryLightColor: (config, value) => config.palette.secondary.light = value,
    secondaryDarkColor: (config, value) => config.palette.secondary.dark = value,
    tagColor: (config, value) => config.palette.custom.tag = value,
    tagTextColor: (config, value) => config.palette.custom.tagText = value
  }

  @observable displayError = false
  @observable errorInfo

  events = new EventEmitter()
  on = this.events.on
  emit = this.events.emit
  config = {}
  colors = scaleOrdinal()

  constructor(...parents) {
    assign(this, this.transformValues(deepmerge.all([...parents], {
      arrayMerge: (destinationArray, sourceArray, options) => sourceArray
    })))
    this.colors
      .range(this.config.palette.custom.donut)
    this.closeButtonVisible = this.config.showCloseButton
  }

  transformValues = values => {
    if (values && values.config) {
      const {config} = values
      Object
        .keys(this.transforms)
        .forEach(key => {
          if (config[key]) {
            this.transforms[key](config, config[key])
            delete config[key]
          }
        })
      const {palette, donutSaturation} = config
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

  @action handleRejection = e => {
    this.handleError(e)
  }

  @action handleError = (e, opts = {}) => {
    // log to console
    console.error('handleError called', {e, opts})

    // notify partner
    let handler
    handler = this.errorHandler

    // display error
    // the handler could be a function or an image url
    this.errorInfo = {
      returnValue: isFunction(handler) ? handler(e) : handler,
      error: e
    }
    this.displayError = true
  }
}

rootContextStore = new ContextStore(defaults)

export default rootContextStore

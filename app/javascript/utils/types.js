import { assign } from 'es6-object-assign'

export function isArray(d) {
  return Object.prototype.toString.call(d) === '[object Array]'
}

export function isBoolean(d) {
  return Object.prototype.toString.call(d) === '[object Boolean]'
}

export function isDate(d) {
  return Object.prototype.toString.call(d) === '[object Date]'
}

export function isError(value) {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]':
      return true
    case '[object Exception]':
      return true
    case '[object DOMException]':
      return true
    default:
      return value instanceof Error
  }
}

export function isFunction(f) {
  return Object.prototype.toString.call(f) === '[object Function]'
}

export function isObject(d) {
  return Object.prototype.toString.call(d) === '[object Object]'
}

export function isString(f) {
  return Object.prototype.toString.call(f) === '[object String]'
}

export function isNil(value) {
  // this == is intentional and the same as lodash's isNil
  return value == null
}

export function isNumber(f) {
  return Object.prototype.toString.call(f) === '[object Number]'
}

export function isEmpty(value) {
  return isNil(value) || value.length === 0
}

export function toFixedNumber(number, digits = 2) {
  return Number(number.toFixed(digits))
}

export function isNaN(value) {
  return isNumber(value) && value != +value
}

// this is used for tile config data which can be passed
// programmatically where it would be a js boolean or through
// html data attributes where it would be a string
export function isTrue(value) {
  if (isBoolean(value)) {
    return value
  }
  if (isString(value)) {
    return value.toLowerCase() === 'true'
  }
  return false
}

export function removeProperties(obj, ...props) {
  obj = assign({}, obj)
  props.forEach(prop => delete obj[prop])
  return obj
}

export const noop = () => {}

/*
 * This allows for use with any type that supports comparison operators
 * like  Number, String, and Date.
 *
 * PARAMETERS
 * here: this is a string, number, or date that represents the position in
 *  which a value is in a range of possible values.
 *
 * low: the low end of the range
 * high: the high end of the range
 */
export function between(here, low, high) {
  return low > high
    ? here >= high && here <= low
    : here >= low && here <= high
}

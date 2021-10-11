import select from 'd3'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import { newId } from './ids'
import { primaryGradient, secondaryGradient } from './gradients'
import { diagonalPattern, diagonalReversePattern, emptyPattern } from './patterns'

/*
 * This appends the svg defs that are specific to the passed theme
 * into the target element, returning the svg element so that it can
 * later be removed. It also saves the generated def keys to the theme
 * so they can be used within components.
 */
export const appendDefs = ({
  id = newId('root-'),
  target = global.document.body,
  theme
}) => {
  const { palette } = theme

  const defConfigs = {
    primaryGradient      : primaryGradient(palette),
    secondaryGradient    : secondaryGradient(palette),
    positivePattern      : diagonalPattern(palette.custom.positive),
    positiveLightPattern : diagonalPattern(lighten(palette.custom.positive, 0.4)),
    negativeLightPattern : diagonalPattern(lighten(palette.custom.negative, 0.4)),
    secondaryPattern     : diagonalPattern(palette.secondary.main),
    success              : diagonalPattern(palette.custom.success),
    warning              : diagonalReversePattern(palette.custom.warning),
    error                : emptyPattern(palette.custom.error)
  }

  // create an invisible svg element to store the defs for this instance
  const svgEl = select(target)
    .append('svg')
    .attr('id', `ina-${id}-defs`)
    .attr('aria-hidden', true)
    .style('width', 0)
    .style('height', 0)

  const defsEl = svgEl.append('defs')

  // create a place to refer to defs
  theme.defs = {}

  Object
    .keys(defConfigs)
    .forEach(key => {
      // create a unique pattern id for this instance
      const defId = `ina-${id}-${key}`
      // append def
      defsEl.call(defConfigs[key](defId))
      // add id reference to defs collection
      theme.defs[key] = `#${defId}`
    })

  return svgEl
}

// svg rect does not support a radius on a specific corner
// so this must be done using an svg path
export const roundedRect = ({
  x           = 0,
  y           = 0,
  width       = 100,
  height      = 100,
  radius      = 4,
  topLeft     = true,
  topRight    = true,
  bottomLeft  = true,
  bottomRight = true
}) => {
  const commands = []
  commands.push(`M${x + radius},${y}`)
  commands.push(`h${width - 2 * radius}`)
  // draw top right
  if (topRight) {
    commands.push(`a${radius},${radius} 0 0 1 ${radius},${radius}`)
  } else {
    commands.push(`h${radius}v${radius}`)
  }
  commands.push(`v${height - 2 * radius}`)
  // draw bottom right
  if (bottomRight) {
    commands.push(`a${radius},${radius} 0 0 1 ${-radius},${radius}`)
  } else {
    commands.push(`v${radius}h${-radius}`)
  }
  commands.push(`h${2 * radius - width}`)
  // draw bottom left
  if (bottomLeft) {
    commands.push(`a${radius},${radius} 0 0 1 ${-radius},${-radius}`)
  } else {
    commands.push(`h${-radius}v${-radius}`)
  }
  commands.push(`v${2 * radius - height}`)
  // draw top left
  if (topLeft) {
    commands.push(`a${radius},${radius} 0 0 1 ${radius},${-radius}`)
  } else {
    commands.push(`v${-radius}h${radius}`)
  }
  commands.push('z')
  return commands.join('')
}

// comes from https://bl.ocks.org/martinjc/e46f38d44a049a61ab1c2d97a2413439
export const midAngle = d => {
  return d.startAngle + (d.endAngle - d.startAngle) / 2
}

export const getTransformation = transform => {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttributeNS(null, 'transform', transform)
  const matrix = g.transform.baseVal.consolidate().matrix
  let { a, b, c, d, e, f } = matrix
  let scaleX, scaleY, skewX
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX
  return {
    translateX : e,
    translateY : f,
    rotate     : Math.atan2(b, a) * Math.PI / 180,
    skewX      : Math.atan(skewX) * Math.PI / 180,
    scaleX     : scaleX,
    scaleY     : scaleY
  }
}

export const arrangeLabels = (selection, labelClass) => {
  let move = 1
  while (move > 0) {
    move = 0
    selection
      .selectAll(labelClass)
      .each(function() {
        const that = this
        let a = this.getBoundingClientRect()
        selection
          .selectAll(labelClass)
          .each(function() {
            if (this != that) {
              let b = this.getBoundingClientRect()
              if ((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) && (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                const dx = (Math.max(0, a.right - b.left) + Math.min(0, a.left - b.right)) * 0.01
                const dy = (Math.max(0, a.bottom - b.top) + Math.min(0, a.top - b.bottom)) * 0.1
                const tt = getTransformation(select(this).attr('transform'))
                const to = getTransformation(select(that).attr('transform'))
                move += Math.abs(dx) + Math.abs(dy)
                to.translate = [to.translateX + dx, to.translateY + dy]
                tt.translate = [tt.translateX - dx, tt.translateY - dy]
                select(this).attr('transform', `translate(${tt.translate})`)
                select(that).attr('transform', `translate(${to.translate})`)
                a = this.getBoundingClientRect()
              }
            }
          })
      })
  }
}

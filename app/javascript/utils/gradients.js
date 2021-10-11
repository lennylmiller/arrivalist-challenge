import { darken } from '@material-ui/core/styles/colorManipulator'

export const primaryGradient = palette => name => selection => {
  const gradient = selection.append('linearGradient')
    .attr('id', name)
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', 1)

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', palette.primary.light)

  gradient.append('stop')
    .attr('offset', '70%')
    .attr('stop-color', palette.primary.light)

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', darken(palette.primary.main, 0.01))
}

export const secondaryGradient = palette => name => selection => {
  const gradient = selection.append('linearGradient')
    .attr('id', name)
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', 1)

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', palette.secondary.light)

  gradient.append('stop')
    .attr('offset', '70%')
    .attr('stop-color', palette.secondary.light)

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', darken(palette.secondary.main, 0.01))
}

import { darken } from '@material-ui/core/styles/colorManipulator'

export const diagonalPattern = color => name => selection => {
  const pattern = selection.append('pattern')
    .attr('id', name)
    .attr('width', 6)
    .attr('height', 6)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('patternTransform', 'rotate(40)')

  pattern.append('rect')
    .attr('width', 6)
    .attr('height', 6)
    .style('stroke', 'none')
    .style('fill', darken(color, 0.1))

  pattern.append('rect')
    .attr('width', 5)
    .attr('height', 6)
    .style('stroke', 'none')
    .style('fill', color)
}

export const diagonalReversePattern = color => name => selection => {
  const pattern = selection.append('pattern')
    .attr('id', name)
    .attr('width', 6)
    .attr('height', 6)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('patternTransform', 'rotate(-40)')

  pattern.append('rect')
    .attr('width', 6)
    .attr('height', 6)
    .style('stroke', 'none')
    .style('fill', darken(color, 0.1))

  pattern.append('rect')
    .attr('width', 5)
    .attr('height', 6)
    .style('stroke', 'none')
    .style('fill', color)
}

export const emptyPattern = color => name => selection => {
  const pattern = selection.append('pattern')
    .attr('id', name)
    .attr('width', 6)
    .attr('height', 6)
    .attr('patternUnits', 'userSpaceOnUse')

  pattern.append('rect')
    .attr('width', 6)
    .attr('height', 6)
    .style('stroke', 'none')
    .style('fill', color)
}

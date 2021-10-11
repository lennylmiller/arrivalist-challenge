import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PropTypes as MobxPropTypes, observer } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import {
  max,
  event,
  area as areaFn,
  line as lineFn,
  select,
  brushX,
  timeDay,
  scaleTime,
  timeMonth,
  axisBottom,
  timeFormat,
  isFunction,
  scaleLinear
} from 'd3'
import D3Component from './D3Component'
import withBrowser from './withBrowser'

const Y_LABEL_WIDTH = 15

@withStyles({}, { withTheme: true })
@withBrowser
@observer
class OldBrushableLineChart extends D3Component {

  static propTypes = {
    className       : PropTypes.string,
    usePrimaryColor : PropTypes.bool,
    onSelection     : PropTypes.func,
    theme           : PropTypes.object.isRequired,
    dateExtent      : MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(Date)).isRequired,
    dateSelection   : MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(Date)).isRequired,
    browser: PropTypes.shape({
      isIE11: PropTypes.bool.isRequired
    }).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired
    })).isRequired,
  }

  width      = 650
  height     = 100
  textHeight = 34

  margins = {
    top    : 0,
    left   : 25,
    bottom : 25,
    right  : 25
  }

  plotWidth = this.width - this.margins.left - this.margins.right
  plotHeight = this.height - this.margins.top - this.margins.bottom

  brushWidth = 8
  brushHeight = this.plotHeight / 3

  x = scaleTime()
    .range([Y_LABEL_WIDTH, this.plotWidth])

  y = scaleLinear()
    .range([this.plotHeight - 2, 0])

  area = areaFn()
    .x((d) => this.x(d.key))
    .y0(this.plotHeight)
    .y1((d) => this.y(d.value))

  line = lineFn()
    .x((d) => this.x(d.key))
    .y((d) => this.y(d.value))

  xAxis = axisBottom(this.x)
    .ticks(timeMonth, 1)
    .tickFormat(timeFormat('%b'))

  brush = brushX()
    .extent([[Y_LABEL_WIDTH, 0], [this.plotWidth, this.plotHeight]])
    .handleSize(40) // large handles are easier to use on mobile
    .on('start brush', this.onBrush.bind(this))
    .on('end', this.onBrushEnd.bind(this))

  initialize() {
    const { browser, theme, className, width } = this.props
    const isSmDown = isWidthDown('xs', width)

    this.svg = select(this.refs.svg)
      .attr('class', classNames('BrushableLineChart', className))
      .attr('width', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')

    if (browser.isIE11) {
      this.svg.attr('height', this.height)
    }

    this.yGroup = this.svg.append('g')
      .attr('transform', isSmDown
        ? `translate(25, ${this.margins.top + this.plotHeight})`
        : `translate(25, ${this.margins.top + this.plotHeight}) rotate(-90)`)

    this.yGroup.append('text')
      .attr('x', 0)
      .attr('y', isSmDown ? -1 * (this.plotHeight / 2) : 0)
      .style('font-size', isSmDown ? '14px' : '12px')
      .attr('fill', theme.palette.text.secondary)
      .text(isSmDown ? '$' : 'Amount ($)')

    this.plotGroup = this.svg
      .append('g')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)

    this.plotGroup.append('path')
      .attr('class', 'area')

    this.plotGroup.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .style('stroke-width', 3)

    this.gBrush = this.plotGroup.append('g')
      .attr('class', 'brush')
      .call(this.brush)

    this.handles = this.gBrush
      .selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter().append('rect')
      .attr('class', 'handle--custom')
      .attr('fill', theme.palette.text.secondary)
      .attr('display', 'none')
      .attr('cursor', 'ew-resize')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.brushWidth)
      .attr('height', this.brushHeight)

    this.brushOverlay = this.gBrush.select('.overlay')
    this.brushSelection = this.gBrush.select('.selection')

    // add backdrop
    this.brushBackdropWest = this.gBrush.insert('rect', ':first-child')
      .attr('class', 'backdrop backdrop--w')
      .attr('x', 0)
      .attr('y', 0)

    this.brushBackdropEast = this.gBrush.insert('rect', ':first-child')
      .attr('class', 'backdrop backdrop--e')
      .attr('x', 0)
      .attr('y', 0)

    this.gBrush.selectAll('.backdrop')
      .attr('fill-opacity', 0.8)

    this.gBrush.selectAll('.selection')
      .attr('fill-opacity', 0)
      .attr('stroke', theme.palette.text.secondary)
      .attr('stroke-width', 2)

    this.xAxisGroup = this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${this.margins.left}, ${this.height - this.textHeight + 12})`)
  }

  update() {
    const {
      data,
      dateExtent,
      dateSelection,
      theme,
      usePrimaryColor
    } = this.props

    this.x.domain(dateExtent)

    let yMax = Math.max(1000, max(data, (d) => d.value))

    // add 30% padding to the max value
    yMax = yMax * 0.3 + yMax

    this.y.domain([0, yMax])

    this.svg.select('.area')
      .attr('d', this.area(data))
      .attr('fill', usePrimaryColor
        ? `url(${theme.palette.primary.light})`
        : `url(${theme.palette.secondary.light})`)

    this.svg.select('.line')
      .attr('d', this.line(data))
      .attr('stroke', usePrimaryColor
        ? theme.palette.primary.dark
        : theme.palette.secondary.dark)

    this.xAxisGroup
      .call(this.xAxis)

    this.xAxisGroup.selectAll('.tick line')
      .style('display', 'none')
    this.xAxisGroup.selectAll('.domain')
      .style('display', 'none')
    const axisText = this.xAxisGroup.selectAll('text')
      .style('font-size', '12px')
      .style('color', theme.palette.text.secondary)

    this.xAxisGroup
      .attr('font-family', null)

    axisText.each(function (d, i) {
      if (i === 0) {
        select(this).attr('text-anchor', 'start')
      } else if (i === axisText.size() - 1) {
        select(this).attr('text-anchor', 'end')
      }
    })

    this.lastSelection = dateSelection

    this.gBrush.transition()
      .call(this.brush.move, dateSelection.map(this.x))
  }

  onBrush() {
    // get overaly and selection attributes as numbers
    let
      brushWidth      = +this.brushOverlay.attr('width'),
      selectionX      = +this.brushSelection.attr('x'),
      selectionWidth  = +this.brushSelection.attr('width'),
      selectionHeight = +this.brushSelection.attr('height')

    // update brush backdrop positions
    this.brushBackdropWest.attr('width', Math.max((selectionX - 1), 1))
    this.brushBackdropWest.attr('height', selectionHeight)

    this.brushBackdropEast.attr('x', selectionX + selectionWidth)
    this.brushBackdropEast.attr('width',
      Math.max((brushWidth - (selectionX + selectionWidth)), 0))
    this.brushBackdropEast.attr('height', selectionHeight)

    // it sets crispEdges by default which causes the
    // stroke for the border to sometimes be cut off
    this.brushSelection.attr('shape-rendering', 'auto')

    // adjust handle positions
    if (event.selection) {
      this.handles
        .attr('display', null)
        .attr('transform', (d, i) => {
          return `translate(${event.selection[i] + (i * -this.brushWidth)}, ${this.plotHeight / 3})`
        })
    }
  }

  onBrushEnd() {
    if (!event.sourceEvent) {
      // only handle user events
      return
    }
    let selection = event.selection

    selection = selection && selection.map(this.x.invert)

    // if there is no selection or the range of days
    // selected is less than 7, then use last selection
    if (!selection || timeDay.count(selection[0], selection[1]) < 7) {
      selection = this.lastSelection
      this.brush.move(this.gBrush, selection.map(this.x))
    }

    this.lastSelection = selection

    const { onSelection } = this.props
    if (isFunction(onSelection) && selection) {
      onSelection(selection)
    }
  }
}

export default withWidth()(OldBrushableLineChart)

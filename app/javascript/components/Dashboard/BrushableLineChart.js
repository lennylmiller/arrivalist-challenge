import React, {useRef, useEffect} from 'react'
import {PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core'
import {
  select,
  area as areaFn,
  line as lineFn,
  curveCardinal,
  axisBottom,
  axisLeft,
  scaleLinear,
  scaleTime,
  max,
  timeFormat,
  scaleUtc
} from 'd3'
import useResizeObserver from './useResizeObserver'
import {isWidthDown} from "@material-ui/core/withWidth";
import classNames from "classnames";

const Y_LABEL_WIDTH = 15

const useStyles = makeStyles((theme) => {
  return {
    root: {},
  }
})

const BrushableLineChart = ({
                              data,
                              dateExtent,
                              dateSelection,
                              theme,
                              usePrimaryColor
                            }) => {
  const classes = useStyles()
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  const yValuesOne = []

  const xValuesTheRealOne = data[dataIndex].reduce((xValuesOne, point) => {
    yValuesOne.push(new Date(point.key))
    xValuesOne.push(point.value)
    return xValuesOne
  }, [])

  //--------------------------------------------------------------------------------
  const width = 650
  const height = 100
  const textHeight = 34

  const margins = {
    top: 0,
    left: 25,
    bottom: 25,
    right: 25
  }

  const plotWidth = width - margins.left - margins.right
  const plotHeight = height - margins.top - margins.bottom

  const brushWidth = 8
  const brushHeight = plotHeight / 3

  const x = scaleTime()
    .range([Y_LABEL_WIDTH, plotWidth])

  const y = scaleLinear()
    .range([plotHeight - 2, 0])

  const area = areaFn()
    .x((d) => x(d.key))
    .y0(plotHeight)
    .y1((d) => y(d.value))

  const line = lineFn()
    .x((d) => x(d.key))
    .y((d) => y(d.value))

  const xAxis = axisBottom(x)
    .ticks(timeMonth, 1)
    .tickFormat(timeFormat('%b'))

  const brush = brushX()
    .extent([[Y_LABEL_WIDTH, 0], [plotWidth, plotHeight]])
    .handleSize(40) // large handles are easier to use on mobile
    .on('start brush', onBrush)
    .on('end', onBrushEnd)

  let
    yGroup,
    plotGroup,
    gBrush,
    handles,
    brushOverlay,
    brushSelection,
    brushBackdropWest,
    brushBackdropEast,
    xAxisGroup,
    lastSelection

  //--------------------------------------------------------------------------------

  useEffect(() => {
    const {browser, theme, className, width} = props
    const isSmDown = isWidthDown('xs', width)
    const svg = select(svgRef.current)

    svg
      .attr('class', classNames('BrushableLineChart', className))
      .attr('width', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')

    if (browser.isIE11) {
      svg.attr('height', height)
    }

    yGroup = svg.append('g')
      .attr('transform', isSmDown
        ? `translate(25, ${margins.top + plotHeight})`
        : `translate(25, ${margins.top + plotHeight}) rotate(-90)`)

    yGroup.append('text')
      .attr('x', 0)
      .attr('y', isSmDown ? -1 * (plotHeight / 2) : 0)
      .style('font-size', isSmDown ? '14px' : '12px')
      .attr('fill', theme.palette.text.secondary)
      .text(isSmDown ? '$' : 'Amount ($)')

    plotGroup = svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)

    plotGroup.append('path')
      .attr('class', 'area')

    plotGroup.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .style('stroke-width', 3)

    gBrush = plotGroup.append('g')
      .attr('class', 'brush')
      .call(brush)

    handles = gBrush
      .selectAll('.handle--custom')
      .data([{type: 'w'}, {type: 'e'}])
      .enter().append('rect')
      .attr('class', 'handle--custom')
      .attr('fill', theme.palette.text.secondary)
      .attr('display', 'none')
      .attr('cursor', 'ew-resize')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', brushWidth)
      .attr('height', brushHeight)

    brushOverlay = gBrush.select('.overlay')
    brushSelection = gBrush.select('.selection')

    // add backdrop
    brushBackdropWest = gBrush.insert('rect', ':first-child')
      .attr('class', 'backdrop backdrop--w')
      .attr('x', 0)
      .attr('y', 0)

    brushBackdropEast = gBrush.insert('rect', ':first-child')
      .attr('class', 'backdrop backdrop--e')
      .attr('x', 0)
      .attr('y', 0)


    gBrush.selectAll('.backdrop')
      .attr('fill-opacity', 0.8)

    gBrush.selectAll('.selection')
      .attr('fill-opacity', 0)
      .attr('stroke', theme.palette.text.secondary)
      .attr('stroke-width', 2)

    xAxisGroup = svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${margins.left}, ${height - textHeight + 12})`)
  }, [])

  useEffect(() => {
      x.domain(dateExtent)

      let yMax = Math.max(1000, max(data, (d) => d.value))

      // add 30% padding to the max value
      yMax = yMax * 0.3 + yMax

      y.domain([0, yMax])

      svg.select('.area')
        .attr('d', area(data))
        .attr('fill', usePrimaryColor
          ? `url(${theme.defs.primaryGradient})`
          : `url(${theme.defs.secondaryGradient})`)

      svg.select('.line')
        .attr('d', line(data))
        .attr('stroke', usePrimaryColor
          ? theme.palette.primary.dark
          : theme.palette.secondary.dark)

      xAxisGroup
        .call(xAxis)

      xAxisGroup.selectAll('.tick line')
        .style('display', 'none')
      xAxisGroup.selectAll('.domain')
        .style('display', 'none')
      const axisText = xAxisGroup.selectAll('text')
        .style('font-size', '12px')
        .style('color', theme.palette.text.secondary)

      xAxisGroup
        .attr('font-family', null)

      axisText.each(function (d, i) {
        if (i === 0) {
          select(wrapperRef.current).attr('text-anchor', 'start')
        } else if (i === axisText.size() - 1) {
          select(wrapperRef.current).attr('text-anchor', 'end')
        }
      })

      lastSelection = dateSelection

      gBrush.transition()
        .call(brush.move, dateSelection.map(x))
    },
    [xValuesTheRealOne, yValuesOne, dimensions]
  )

  const onBrush = () => {
    // get overlay and selection attributes as numbers
    let
      brushWidth = +brushOverlay.attr('width'),
      selectionX = +brushSelection.attr('x'),
      selectionWidth = +brushSelection.attr('width'),
      selectionHeight = +brushSelection.attr('height')

    // update brush backdrop positions
    brushBackdropWest.attr('width', Math.max((selectionX - 1), 1))
    brushBackdropWest.attr('height', selectionHeight)

    brushBackdropEast.attr('x', selectionX + selectionWidth)
    brushBackdropEast.attr('width',
      Math.max((brushWidth - (selectionX + selectionWidth)), 0))
    brushBackdropEast.attr('height', selectionHeight)

    // it sets crispEdges by default which causes the
    // stroke for the border to sometimes be cut off
    brushSelection.attr('shape-rendering', 'auto')

    // adjust handle positions
    if (event.selection) {
      handles
        .attr('display', null)
        .attr('transform', (d, i) => {
          return `translate(${event.selection[i] + (i * -brushWidth)}, ${plotHeight / 3})`
        })
    }
  }

  const onBrushEnd = () => {
    if (!event.sourceEvent) {
      // only handle user events
      return
    }
    let selection = event.selection

    selection = selection && selection.map(x.invert)

    // if there is no selection or the range of days
    // selected is less than 7, then use last selection
    if (!selection || timeDay.count(selection[0], selection[1]) < 7) {
      selection = lastSelection
      brush.move(gBrush, selection.map(x))
    }

    lastSelection = selection

    const {onSelection} = props
    if (isFunction(onSelection) && selection) {
      onSelection(selection)
    }
  }

  return (
    <React.Fragment>
      <div className={classes.svgContainer} ref={wrapperRef} style={{marginBottom: '2rem'}}>
        <svg ref={svgRef}>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis"/>
          <g className="y-axis"/>
        </svg>
      </div>
    </React.Fragment>
  )
}

BrushableLineChart.propTypes = {
  className: PropTypes.string,
  usePrimaryColor: PropTypes.bool,
  onSelection: PropTypes.func,
  theme: PropTypes.object.isRequired,
  dateExtent: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(Date)).isRequired,
  dateSelection: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(Date)).isRequired,
  browser: PropTypes.shape({
    isIE11: PropTypes.bool.isRequired
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired
  })).isRequired,
}

export default BrushableLineChart


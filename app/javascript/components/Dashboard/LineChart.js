import React, {useRef, useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core'
import {
  select,
  line,
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

const useStyles = makeStyles((theme) => {
  return {
    root: {},
    svgContainer: {
      width: 910,
      height: 350
    },
    state: {
      fill: theme.palette.primary
    },
    selectedState: {
      fill: theme.palette.primary
    }
  }
})

const LineChart = ({data, dataIndex, id = 'LineChart-Delta'}) => {
  const classes = useStyles()
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  const yValuesOne = []
  // data is currently an array as I am going to add multiple chart lines
  // in order to compare across years.
  const xValuesTheRealOne = data[dataIndex].reduce((xValuesOne, point) => {
    yValuesOne.push(new Date(point.key))
    xValuesOne.push(point.value)
    return xValuesOne
  }, [])

  useEffect(() => {
    const svg = select(svgRef.current)
    const svgContent = svg.select('.content')
    const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect()

    // Match the container (see styles svgContainer)
    svg.attr('viewBox', '-40 0 960 400')

    // scales + line generator
    let start = yValuesOne[0]
    let end = yValuesOne[yValuesOne.length - 1]

    const xScale = scaleTime()
      .domain([start, end])
      .range([0, width - 80])

    const yScale = scaleLinear()
      .domain([0, max(xValuesTheRealOne)])
      .range([height - 10, 10])

    const otherOne = scaleLinear()
      .domain([0, xValuesTheRealOne.length - 1])
      .range([10, width - 80])

    // tool tip
    const x = scaleUtc()
      .domain([start, end])
      .range([0, width - 80])

    const y = scaleLinear()
      .domain([0, max(xValuesTheRealOne)])
      .range([height - 10, 10])

    const lineGenerator = line()
      .x((d, index) => otherOne(index))
      .y((d) => yScale(d))
      .curve(curveCardinal)

    // render the line
    svgContent
      .selectAll('.myLine')
      .data([xValuesTheRealOne])
      .join('path')
      .attr('class', 'myLine')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('d', lineGenerator)

    svgContent
      .selectAll('.myDot')
      .data(xValuesTheRealOne)
      .join('circle')
      .attr('class', 'myDot')
      .attr('stroke', 'black')
      .attr('r', 4)
      .attr('fill', 'orange')
      .attr('cx', (value, index) => {
        return otherOne(index)
      })
      .attr('cy', yScale)

    // axes
    const xAxis = axisBottom(xScale)
      .tickFormat(timeFormat('%m-%b-%y'))

    svg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height - 8})`)
      .call(xAxis)

    const yAxis = axisLeft(yScale)
    svg.select('.y-axis').call(yAxis)
  }, [xValuesTheRealOne, yValuesOne, dimensions])

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

export default LineChart

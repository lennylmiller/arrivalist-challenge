import React, { useRef, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  axisLeft,
  scaleLinear,
  scaleTime,
  zoom,
  max,
  timeFormat,
  scaleUtc

} from 'd3'
import useResizeObserver from './useResizeObserver'

const useStyles = makeStyles((theme) => {
  return {
    root:          {},
    svgContainer:  {
      width:  910,
      height: 350
    },
    state:         {
      fill: theme.palette.primary
    },
    selectedState: {
      fill: theme.palette.primary
    }
  }
})

const LineChart = ({ data, dataIndex, id = 'LineChart-Delta' }) => {
  const classes = useStyles()
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  const [currentZoomState, setCurrentZoomState] = useState()
  const yValuesOne = []

  const xValuesTheRealOne = data[dataIndex].reduce((xValuesOne, point) => {
    yValuesOne.push(new Date(point.key))
    xValuesOne.push(point.value)
    return xValuesOne
  }, [])


  useEffect(() => {
      const svg = select(svgRef.current)
      const svgContent = svg.select('.content')
      const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect()

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

      // zoomable
      // TODO: Nice-To-Have
      // if (currentZoomState) {
      //   const newOtherOne = currentZoomState.rescaleX(otherOne)
      //   const newXScale = currentZoomState.rescaleX(xScale)
      //   otherOne.domain(newOtherOne.domain())
      //   xScale.domain(newXScale.domain())
      // }


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

      // tooltip
      const tooltip = svg.append('g')

      // TODO: Implement tooltip
      // https://observablehq.com/@d3/line-chart-with-tooltip
      svg.on('touchmove mousemove', function(event) {
        // const { date, value } = bisect(pointer(event, this)[0])
        const value = 123
        const date = new Date()

        const newX = x(date) + 1000
        const newY = y(date) + 100

        tooltip
          .attr('transform', `translate(${newX}, ${newY})`)
          .call(callout, `${value} ${date}`)
      })

      // axes
      const xAxis = axisBottom(xScale)
        .tickFormat(timeFormat('%m-%b-%y'))

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height - 8})`)
        .call(xAxis)

      const yAxis = axisLeft(yScale)
      svg.select('.y-axis').call(yAxis)

      // zoom
      const zoomBehavior = zoom()
        .scaleExtent([0.5, 5])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .on('zoom', function(event) {
          const zoomState = event.transform
          setCurrentZoomState(zoomState)
        })
      svg.call(zoomBehavior)
    },
    [currentZoomState, xValuesTheRealOne, yValuesOne, dimensions]
  )

  return (
    <React.Fragment>
      <div className={classes.svgContainer} ref={wrapperRef} style={{ marginBottom: '2rem' }}>
        <svg ref={svgRef}>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis"/>
          <g className="y-axis"/>
        </svg>
      </div>
    </React.Fragment>
  )
}

const callout = (g, value) => {
  if (! value) return g.style('display', 'none')

  g
    .style('display', null)
    .style('pointer-events', 'none')
    .style('font', '10px sans-serif')

  const path = g.selectAll('path')
    .data([null])
    .join('path')
    .attr('fill', 'white')
    .attr('stroke', 'black')

  const text = g.selectAll('text')
    .data([null])
    .join('text')
    .call(text => text
      .selectAll('tspan')
      .data((value + '').split(/\n/))
      .join('tspan')
      .attr('x', 0)
      .attr('y', (d, i) => `${i * 1.1}em`)
      .style('font-weight', (_, i) => i ? null : 'bold')
      .text(d => d))

  const { y, width: w, height: h } = text.node().getBBox()

  text.attr('transform', `translate(${-w / 2},${15 - y})`)
  path.attr('d', `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`)
}


export default LineChart

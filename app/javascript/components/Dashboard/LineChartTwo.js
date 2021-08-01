import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import './styles.css'

class LineChartTwo extends React.Component {
  componentDidMount() {
    this.renderMultiChart()
  }

  render() {
    return (
      <div className="App">
        <div id="chart"/>
      </div>
    )
  }

  renderMultiChart() {
    let data = [
      {
        name:   'USA',
        values: [
          { date: '2000', price: '100' },
          { date: '2001', price: '110' },
          { date: '2002', price: '145' },
          { date: '2003', price: '241' },
          { date: '2004', price: '101' },
          { date: '2005', price: '90' },
          { date: '2006', price: '10' },
          { date: '2007', price: '35' },
          { date: '2008', price: '21' },
          { date: '2009', price: '201' }
        ]
      },
      {
        name:   'Canada',
        values: [
          { date: '2000', price: '200' },
          { date: '2001', price: '120' },
          { date: '2002', price: '33' },
          { date: '2003', price: '21' },
          { date: '2004', price: '51' },
          { date: '2005', price: '190' },
          { date: '2006', price: '120' },
          { date: '2007', price: '85' },
          { date: '2008', price: '221' },
          { date: '2009', price: '101' }
        ]
      },
      {
        name:   'Maxico',
        values: [
          { date: '2000', price: '50' },
          { date: '2001', price: '10' },
          { date: '2002', price: '5' },
          { date: '2003', price: '71' },
          { date: '2004', price: '20' },
          { date: '2005', price: '9' },
          { date: '2006', price: '220' },
          { date: '2007', price: '235' },
          { date: '2008', price: '61' },
          { date: '2009', price: '10' }
        ]
      }
    ]

    let width = 500
    let height = 300
    let margin = 50
    let duration = 250

    let lineOpacity = '0.25'
    let lineOpacityHover = '0.85'
    let otherLinesOpacityHover = '0.1'
    let lineStroke = '1.5px'
    let lineStrokeHover = '2.5px'

    let circleOpacity = '0.85'
    let circleOpacityOnLineHover = '0.25'
    let circleRadius = 3
    let circleRadiusHover = 6

    /* Format Data */
    let parseDate = d3.timeParse('%Y')
    data.forEach(function(d) {
      d.values.forEach(function(d) {
        d.date = parseDate(d.date)
        d.price = +d.price
      })
    })

    /* Scale */
    let xScale = d3
      .scaleTime()
      .domain(d3.extent(data[0].values, d => d.date))
      .range([0, width - margin])

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data[0].values, d => d.price)])
      .range([height - margin, 0])

    let color = d3.scaleOrdinal(d3.schemeCategory10)

    /* Add SVG */
    let svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + margin + 'px')
      .attr('height', height + margin + 'px')
      .append('g')
      .attr('transform', `translate(${margin}, ${margin})`)

    /* Add line into SVG */
    let line = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.price))

    let lines = svg.append('g').attr('class', 'lines')

    lines
      .selectAll('.line-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'line-group')
      .on('mouseover', function(d, i) {
        svg
          .append('text')
          .attr('class', 'title-text')
          .style('fill', color(i))
          .text(d.name)
          .attr('text-anchor', 'middle')
          .attr('x', (width - margin) / 2)
          .attr('y', 5)
      })
      .on('mouseout', function(d) {
        svg.select('.title-text').remove()
      })
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .on('mouseover', function(d) {
        d3.selectAll('.line').style('opacity', otherLinesOpacityHover)
        d3.selectAll('.circle').style('opacity', circleOpacityOnLineHover)
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style('stroke-width', lineStrokeHover)
          .style('cursor', 'pointer')
      })
      .on('mouseout', function(d) {
        d3.selectAll('.line').style('opacity', lineOpacity)
        d3.selectAll('.circle').style('opacity', circleOpacity)
        d3.select(this)
          .style('stroke-width', lineStroke)
          .style('cursor', 'none')
      })

    /* Add circles in the line */
    lines
      .selectAll('circle-group')
      .data(data)
      .enter()
      .append('g')
      .style('fill', (d, i) => color(i))
      .selectAll('circle')
      .data(d => d.values)
      .enter()
      .append('g')
      .attr('class', 'circle')
      .on('mouseover', function(d) {
        d3.select(this)
          .style('cursor', 'pointer')
          .append('text')
          .attr('class', 'text')
          .text(`${d.price}`)
          .attr('x', d => xScale(d.date) + 5)
          .attr('y', d => yScale(d.price) - 10)
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .style('cursor', 'none')
          .transition()
          .duration(duration)
          .selectAll('.text')
          .remove()
      })
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.price))
      .attr('r', circleRadius)
      .style('opacity', circleOpacity)
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr('r', circleRadiusHover)
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr('r', circleRadius)
      })

    /* Add Axis into SVG */
    let xAxis = d3.axisBottom(xScale).ticks(5)
    let yAxis = d3.axisLeft(yScale).ticks(5)

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(xAxis)

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .attr('fill', '#000')
      .text('Total values')
  }
}

export default LineChartTwo

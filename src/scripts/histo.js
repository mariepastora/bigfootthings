import * as d3 from 'd3'

let margin = { top: 50, left: 50, right: 50, bottom: 50 }

let height = 400 - margin.top - margin.bottom

let width = 600 - margin.left - margin.right

var svg = d3
  .select('#hist')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('background','white')

  var xPositionScale = d3.scaleBand().range([0, width])
  var heightScale = d3
    .scaleLinear()
    .domain([0, 275])
    .range([0, height])

    var colorScale = d3.scaleOrdinal()
    .range(['#87717A', '#B9A994', '#E7E0E9', '#F5DCE6', '#9B6970', '#D39DA4', '#B2AC84', '#FFCDD4'])


d3.csv(require('../data/hist_data.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  var words = datapoints.map(function(d) {
    return d.token
  })
  console.log(words)
  xPositionScale.domain(words)


  // Add and style your marks here
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('y', function(d) {
      return height - heightScale(d['n'])
    })
    .attr('x', function(d) {
      return xPositionScale(d.token)
    })
    .attr('height', function(d) {
      return heightScale(d.n)
    })
    .attr('width', xPositionScale.bandwidth())
    .attr('fill', function(d) {
      return colorScale(d.token)
    })

  // var yAxis = d3.axisLeft(heightScale)
  // svg
  //   .append('g')
  //   .attr('class', 'axis y-axis')
  //   .call(yAxis)
  //
  // var xAxis = d3.axisBottom(xPositionScale)
  // svg
  //   .append('g')
  //   .attr('class', 'axis x-axis')
  //   .attr('transform', 'translate(0,' + height + ')')
  //   .call(xAxis)
}

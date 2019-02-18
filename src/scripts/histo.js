import * as d3 from 'd3'

let margin = { top: 50, left: 50, right: 50, bottom: 50 }

let height = 400 - margin.top - margin.bottom

let width = 600 - margin.left - margin.right

let margin_bf = { top: 50, left: 50, right: 50, bottom: 50 }

let height_bf = 400

let width_bf = 200

let svg = d3
  .select('#hist')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var xPositionScale = d3.scaleBand().range([0, width])
  var heightScale = d3
    .scaleLinear()
    .domain([0, 275])
    .range([0, height])

    var colorScale = d3.scaleOrdinal()
    .range(['#87717A', '#B9A994', '#E7E0E9', '#F5DCE6', '#9B6970', '#D39DA4', '#B2AC84', '#FFCDD4'])

var bfSVG = d3
  .select("#test")
  .attr('height', height_bf )
  .attr('width', width_bf )
  .attr('transform', 'translate(' + margin_bf.left + ',' + margin_bf.top + ')')

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
    .classed("large", function(d) {
    return d.token === 'large' })
    .classed("hairy", function(d) {
    return d.token === 'hairy'
  })
    .classed("tall", function(d) {
    return d.token === 'tall'
  })
    .attr('y', height)
    .attr('x', function(d) {
      return xPositionScale(d.token)
    })
    .attr('width', xPositionScale.bandwidth())
    .attr('fill', 'transparent')


  d3.select('#large').on('stepin', () => {
      console.log("step 1")
    svg
      .selectAll('.large')
      .transition()
      .duration(500)
      .attr('fill', function(d) {
         return colorScale(d.token)
       })
      .attr('y', function(d) {
        return height - heightScale(d['n'])
      })
      .attr('height', function(d) {
        return heightScale(d.n)
      })

      bfSVG
      .attr('width', width_bf + 20)
      .selectAll('polygon')
      .attr('stroke', 'white')
      .attr('fill', 'lightgrey')

  })

  d3.select('#tall').on('stepin', () => {
      console.log("step 2")
    svg
      .selectAll('.tall')
      .transition()
      .duration(500)
      .attr('fill', function(d) {
         return colorScale(d.token)
       })
      .attr('y', function(d) {
        return height - heightScale(d['n'])
      })
      .attr('height', function(d) {
        return heightScale(d.n)
      })
    bfSVG
      // .attr('width', width_bf + 20)
      .selectAll('polygon')
      .attr('fill', 'yellow')
  })

  d3.select('#hairy').on('stepin', () => {
      console.log("step 2")
    // Grab all the bars, make them 0
    svg
      .selectAll('.hairy')
      .transition()
      .duration(500)
      .attr('fill', function(d) {
         return colorScale(d.token)
       })
      .attr('y', function(d) {
        return height - heightScale(d['n'])
      })
      .attr('height', function(d) {
        return heightScale(d.n)
      })

      bfSVG
      // .attr('width', width_bf + 20)
      .selectAll('polygon')
      .attr('fill', 'brown')
  })



  var yAxis = d3.axisLeft(heightScale)
  svg
    .append('g')
    .attr('class', 'axis')
    .call(yAxis)

  var xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}

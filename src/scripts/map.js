import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 50, left: 50, right: 50, bottom: 50 }

let height = 600 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#map')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .style('background', '#02020E')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let projection = d3.geoMercator().center([0, 41.83]).translate([width / 2, height / 2])


// out geoPath needs a PROJECTION variable
let path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('../data/us.topojson')),
  d3.csv(require('../data/state_bf.csv')),
  d3.csv(require('../data/dots_without_alaska.csv'))

])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, incarceration, allPoints]) {
  let states = topojson.feature(json, json.objects.states)
  states.features = states.features.filter(d => d.id !== 72 && d.id !== 78)

  // Not sure how to do scale/center/etc?
  // Just use .fitSize to center your map
  // and set everything up nice
  // projection.fitSize([width, height], states)

  svg
    .append('g')
    .attr('id', 'mapUSA')
    .attr('transform', 'translate(-360,-1200) scale(5.4)')
    .selectAll('.state')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    //.attr('fill', 'white')
    .attr('fill', 'rgba(0,0,0,0.01)')
    .on('mouseenter', function(d) {
      d3.select(this).attr('stroke', 'white')
      .style('stroke-width', 0.5)
    })
    .on('mouseleave', function(d) {
      d3.select(this).attr('stroke', 'none')
    })


    /* Weird pudding stuff goes here */
  var radiusScale = d3.scaleSqrt()
    .domain([1000,50000])
    .range([1,3.5])
    .clamp(true)

  console.log(allPoints)

  var xExtent = d3.extent(allPoints, d => +d.rounded_lng)
  var yExtent = d3.extent(allPoints, d => +d.rounded_lat)

  let jailExtent = d3.extent(allPoints, d => +d.concentration)

  var colorScale = d3.scaleSequential(d3.interpolatePuRd)
    .domain(jailExtent)
    .clamp(true)

  let xPositionScale = d3.scaleLinear().domain(xExtent).range([0, width])
  let yPositionScale = d3.scaleLinear().domain(yExtent).range([height,0])

  svg.append('g')
    .raise()
    .selectAll('circle')
    .data(allPoints)
    .enter().append('circle')
    .attr('r', 2)
    .attr('cx', d => xPositionScale(+d.rounded_lng))
    .attr('cy', d => yPositionScale(+d.rounded_lat))
    .attr('fill', d => {
      return colorScale(d.concentration*7)
    })
    .on('mouseover', function(d){
      console.log(d.rounded_lng)
    })

}

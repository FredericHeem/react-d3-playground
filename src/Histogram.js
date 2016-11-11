import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";

function axisX(data, dimension) {
  const axisX = d3.scaleLinear().rangeRound([0, dimension.width]).domain([
    d3.min(data),
    d3.max(data)
  ]);
  return axisX;
}

function drawAxisX(svg, axis, dimension) {
  const {height, width, margin} = dimension;

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(axis.x))

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 40)
    .style("text-anchor", "middle")
    .text("Rate Of Return (%)");
}

function createBins(axis, data) {
  return d3.histogram().domain(axis.x.domain()).thresholds(axis.x.ticks(40))(data)
}

function axisY(data, dimension, bins) {
  const axisY = d3.scaleLinear()
    .range([dimension.height, 0])
    .domain([
      0,
      d3.max(bins, bin => bin.length / bins.length)
    ]);
  return axisY;
}

function drawAxisY(svg, data, axis, dimension) {
  const {height, margin} = dimension;

  svg.append("g")
    .call(d3.axisLeft(axis.y));

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Frequency (%)");
}

function drawHistogram(svg, data, axis, dimension, bins) {

  const bar = svg.selectAll(".bar")
    .data(bins)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", d => `translate(${axis.x(d.x0)}, ${axis.y(d.length / bins.length)})`)

  bar.append("rect")
    .attr("x", 1)
    .attr("width", axis.x(bins[1].x1) - axis.x(bins[1].x0) - 2)
    .attr("height", d => dimension.height - axis.y(d.length / bins.length))
}


function createSvg(graph, id, dimension) {
  const {height, width, margin} = dimension;
  return d3.select(graph).append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('id', id)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
}

function draw(graph, props) {
  const { data, id, dimension} = props;
  if (data.length === 0) {
    return
  }

  const svg = createSvg(graph, id, dimension)
  const axis = {
    x: axisX(data, dimension)
  }

  console.log("data.length ", data.length)
  const bins = createBins(axis, data);
  console.log("bins.length ", bins.length)
  bins.forEach(bin => {
    console.log(bin)
    console.log("length ", bin.length)
  })
  const sumLengthBin = bins.reduce((acc, bin) => {
    return acc + bin.length
  }, 0)
  console.log("sumLengthBin" , sumLengthBin);
  axis.y = axisY(data, dimension, bins)
  drawHistogram(svg, data, axis, dimension, bins)
  drawAxisX(svg, axis, dimension)
  drawAxisY(svg, data, axis, dimension)
}

export default class Histogram extends Component {
  displayName: 'Histogram';

  propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
    dimension: PropTypes.object
  }

  componentDidMount() {
    draw(this.refs.graph, this.props);
  }

  componentDidUpdate() {
    const svg = d3.select(this.props.id);
    svg.remove();
    draw(this.refs.graph, this.props);
  }

  render() {
    return (
      <div ref="graph"></div>
    )
  }
}

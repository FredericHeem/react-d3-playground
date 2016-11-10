import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";

function axisX(data, dimension) {
  const axisX = d3.scaleTime().range([0, dimension.width]);
  axisX.domain(d3.extent(data, d => d.date));
  return axisX;
}

function drawAxisX(svg, axis, dimension) {
  const {height, width, margin} = dimension;

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(axis.x).tickFormat(d3.timeFormat("%Y-%b-%d")))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // text label for the x axis
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 80)
    .style("text-anchor", "middle")
    .text("Date");
}

function axisY(data, dimension) {
  const axisY = d3.scaleLinear().range([dimension.height, 0]);
  axisY.domain([
    d3.min(data, d => d.close),
    d3.max(data, d => d.close)
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
    .text("Price");
}

function line(axis) {
  return d3.line()
    .x(data => axis.x(data.date))
    .y(data => axis.y(data.close));
}

function drawLine(svg, data, axis) {
  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line(axis));
}

function area(axis, dimension) {
  return d3.area()
    .x(data => axis.x(data.date))
    .y0(dimension.height)
    .y1(data => axis.y(data.close));
}

function drawArea(svg, data, axis, dimension) {
  svg.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", area(axis, dimension));
}

function drawGradient(svg, data, axis, dimension) {
  svg.append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", axis.y(d3.min(data, d => d.close)))
    .attr("x2", 0).attr("y2", axis.y(d3.max(data, d => d.close)))
  .selectAll("stop")
    .data([
     {offset: "0%", color: "steelblue"},
      {offset: "100%", color: "lightsteelblue"}
    ])
  .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);
}

function gridLinesX(axis) {
  return d3.axisBottom(axis.x)
    .ticks(8)
}

function drawGridLinesX(svg, axis, dimension) {
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + dimension.height + ")")
    .call(gridLinesX(axis)
      .tickSize(-dimension.height)
      .tickFormat("")
    )
}

function gridLinesY(axis) {
  return d3.axisLeft(axis.y)
    .ticks(8)
}

function drawGridLinesY(svg, axis, dimension) {
  svg.append("g")
    .attr("class", "grid")
    .call(gridLinesY(axis)
      .tickSize(-dimension.width)
      .tickFormat("")
    )
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
    x: axisX(data, dimension),
    y: axisY(data, dimension)
  }

  drawLine(svg, data, axis)
  drawArea(svg, data, axis, dimension)
  drawGradient(svg, data, axis, dimension)
  drawAxisX(svg, axis, dimension)
  drawAxisY(svg, data, axis, dimension)
  drawGridLinesX(svg, axis, dimension)
  drawGridLinesY(svg, axis, dimension)
}

export default class Chart extends Component {
  displayName: 'Chart';

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

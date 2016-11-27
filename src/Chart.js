import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";
import {createSvg} from './D3Utils';

import {AxisX, AxisY} from './Axis'

function axisY(data, config) {
  const {dimension} = config;
  const axisY = d3.scaleLinear().range([dimension.height, 0]);
  axisY.domain([
    0,
    d3.max(data, d => d.close)
  ]);
  return axisY;
}

function drawAxisY(svg, data, axis, config) {
  const {dimension} = config;
  const {height, margin} = dimension;

  svg.append("g")
    .call(d3.axisLeft(axis.y));

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(config.axis.y.title);
}

function line(axis) {
  return d3.line()
    .x(data => axis.x.scale(data.date))
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
    .x(data => axis.x.scale(data.date))
    .y0(dimension.height)
    .y1(data => axis.y(data.close));
}

function drawArea(svg, data, axis, config) {
  const {dimension} = config;
  svg.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", area(axis, dimension));
}

function drawGradient(svg, data, axis, config) {
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
  return d3.axisBottom(axis.x.scale)
    .ticks(8)
}

function drawGridLinesX(svg, axis, config) {
  const {dimension} = config;
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

function drawGridLinesY(svg, axis, config) {
  const {dimension} = config;
  svg.append("g")
    .attr("class", "grid")
    .call(gridLinesY(axis)
      .tickSize(-dimension.width)
      .tickFormat("")
    )
}

function draw(graph, props) {
  const { data, id, config} = props;
  const {dimension} = config;
  if (data.length === 0) {
    return
  }
  const svg = createSvg(graph, id, dimension)
  const axis = {
    y: axisY(data, config)
  }

  axis.x = AxisX(config.axis.x, dimension);
  axis.x.draw(svg);
  drawLine(svg, data, axis)
  drawArea(svg, data, axis, config)
  drawGradient(svg, data, axis, config)
  //drawAxisX(svg, axis, config)
  drawAxisY(svg, data, axis, config)
  drawGridLinesX(svg, axis, config)
  drawGridLinesY(svg, axis, config)
}

export default class Chart extends Component {
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

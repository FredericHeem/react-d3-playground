import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";
import {createSvg} from './D3Utils';

import {AxisX, AxisY} from './Axis'

function line(axis) {
  return d3.line()
    .x(data => axis.x.scale(data.date))
    .y(data => axis.y.scale(data.close));
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
    .y1(data => axis.y.scale(data.close));
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
    .attr("x1", 0).attr("y1", axis.y.scale(d3.min(data, d => d.close)))
    .attr("x2", 0).attr("y2", axis.y.scale(d3.max(data, d => d.close)))
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
  return d3.axisLeft(axis.y.scale)
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
  const axis = {}
  axis.x = AxisX(config.axis.x, dimension);
  axis.x.draw(svg);
  axis.y = AxisY(config.axis.y, dimension);
  axis.y.draw(svg);
  drawLine(svg, data, axis)
  drawArea(svg, data, axis, config)
  drawGradient(svg, data, axis, config)
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

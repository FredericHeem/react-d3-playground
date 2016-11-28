import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";
import {createSvg} from './D3Utils';
import './Tooltip.css'

import {AxisX} from './Axis'

function createBins(axis, data) {
  return d3.histogram().domain(axis.x.scale.domain()).thresholds(axis.x.scale.ticks(40))(data)
}

function axisY(data, config, bins) {
  const axisY = d3.scaleLinear()
    .range([config.dimension.height, 0])
    .domain([
      0,
      d3.max(bins, bin => bin.length / bins.length)
    ]);
  return axisY;
}

function drawAxisY(svg, data, axis, config) {
  const {dimension} = config
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

function drawHistogram(svg, data, axis, config, bins) {
  const {dimension} = config
  const scaleX = axis.x.scale;
  const bar = svg.selectAll(".bar")
    .data(bins)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", d => `translate(${scaleX(d.x0)}, ${axis.y(d.length / bins.length)})`)

  bar.append("rect")
    .attr("x", 1)
    .attr("width", scaleX(bins[1].x1) - scaleX(bins[1].x0) - 2)
    .attr("height", d => dimension.height - axis.y(d.length / bins.length))
}

function createTooltip({id}) {
  //TODO tooltip
  /*
  const div = d3.select(id).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
*/
}

function draw(graph, props) {
  const { data, id, config} = props;
  const {dimension} = config
  if (data.length === 0) {
    return
  }

  const svg = createSvg(graph, id, dimension)
  const axis = {}

  axis.x = AxisX(config.axis.x, dimension);
  axis.x.draw(svg);

  createTooltip(props)

  console.log("data.length ", data.length)
  const bins = createBins(axis, data);
  console.log("bins.length ", bins.length)

  axis.y = axisY(data, config, bins)
  drawHistogram(svg, data, axis, config, bins)
  drawAxisY(svg, data, axis, config)
}

export default class Histogram extends Component {
  displayName: 'Histogram';

  propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
    config: PropTypes.object
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

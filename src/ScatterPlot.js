import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";

function axisX(data, config, dimension) {
  const axisX = d3.scaleLinear().range([0, dimension.width]);
  axisX.domain(config.axis.x.domain);
  return axisX;
}

function drawAxisX(svg, axis, config, dimension) {
  const {height, width, margin} = dimension;

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(axis.x).ticks(5))

  // text label for the x axis
  svg.append("text")
    .attr("x", width)
    .attr("y", height + margin.top - 30)
    .style("text-anchor", "end")
    .text(config.axis.x.title);
}

function axisY(data, config, dimension) {
  const axisY = d3.scaleLinear().range([dimension.height, 0]);
  axisY.domain(config.axis.y.domain);
  return axisY;
}

function drawAxisY(svg, data, config, axis, dimension) {
  const {height, margin} = dimension;

  svg.append("g")
    .call(d3.axisLeft(axis.y));

  svg.append("text")
    .attr("y", 0 )
    .attr("x", 10)
    .attr("dy", "1em")
    .style("text-anchor", "start")
    .text(config.axis.y.title)
}

function drawPlot(svg, data, axis) {
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 4)
      .attr("cx", d => axis.x(d.stddev))
      .attr("cy", d => axis.y(d.mean));
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
  const { data, id, config, dimension} = props;
  if (data.length === 0) {
    return
  }
  const svg = createSvg(graph, id, dimension)
  const axis = {
    x: axisX(data, config, dimension),
    y: axisY(data, config, dimension)
  }

  drawPlot(svg, data, axis)
  drawAxisX(svg, axis, config, dimension)
  drawAxisY(svg, data, config, axis, dimension)
}

export default class ScatterPlot extends Component {
  displayName: 'ScatterPlot';
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
    //draw(this.refs.graph, this.props);
  }

  render() {
    return (
      <div ref="graph"></div>
    )
  }
}

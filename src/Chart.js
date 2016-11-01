import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";

function axisX(data, dimension) {
  const axisX = d3.scaleTime().range([0, dimension.width]);
  axisX.domain(d3.extent(data, d => d.date));
  return axisX;
}

function axisY(data, dimension) {
  const axisY = d3.scaleLinear().range([dimension.height, 0]);
  axisY.domain([
    d3.min(data, d => d.close),
    d3.max(data, d => d.close)
  ]);
  return axisY;
}

function line(axis) {
  return d3.line()
    .x(data => axis.x(data.date))
    .y(data => axis.y(data.close));
}

function area(axis, dimension) {
  return d3.area()
    .x(data => axis.x(data.date))
    .y0(dimension.height)
    .y1(data => axis.y(data.close));
}

function drawLine(context, data, axis) {
  context.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line(axis));
}

function drawArea(context, data, axis, dimension) {
  context.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", area(axis, dimension));
}

function drawAxis(context, data, axis, dimension) {
  const {height, width, margin} = dimension;

  context.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(axis.x).tickFormat(d3.timeFormat("%Y-%b-%d")))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // text label for the x axis
  context.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 80)
    .style("text-anchor", "middle")
    .text("Date");

  context.append("g")
    .call(d3.axisLeft(axis.y));

  context.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Price");

}

export default class Chart extends Component {
  displayName: 'Chart';

  propTypes: {
    id: PropTypes.string,
    dimension: PropTypes.object,
    backgroundColor: PropTypes.string,
    foregroundColor: PropTypes.string
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  draw() {
    if (this.props.data.length === 0) {
      return
    }
    const context = this.setContext();
    const {data, dimension} = this.props;
    const axis = {
      x: axisX(data, dimension),
      y: axisY(data, dimension)
    }

    drawLine(context, data, axis)
    drawArea(context, data, axis, dimension)
    drawAxis(context, data, axis, dimension)
  }

  redraw() {
    const context = d3.select(this.props.id);
    context.remove();
    this.draw();
  }

  setContext() {
    const { dimension, id} = this.props;
    const {height, width, margin} = dimension;
    return d3.select(this.refs.graph).append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .attr('id', id)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  }

  render() {
    return (
      <div ref="graph"></div>
    )
  }
}

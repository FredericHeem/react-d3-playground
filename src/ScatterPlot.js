import React, { Component, PropTypes } from 'react';
import * as d3 from "d3";
import { createSvg } from './D3Utils';
import { processTex } from './MathJaxSupport';
import {AxisX, AxisY} from './Axis'

function drawPlot(svg, data, axis) {
  svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
    .attr("r", 4)
    .attr("cx", d => axis.x.scale(d.stddev))
    .attr("cy", d => axis.y.scale(d.mean));
}

function draw(graph, props) {
  const { data, id, config} = props;
  const {dimension} = config
  if (data.length === 0) {
    return
  }
  const svg = createSvg(graph, id, dimension)

  const axis = {
  }

  axis.x = AxisX(config.axis.x, dimension);
  axis.y = AxisY(config.axis.y, dimension);
  axis.x.draw(svg)
  axis.y.draw(svg)
  drawPlot(svg, data, axis)
  processTex(svg, ".tex")
}

export default class ScatterPlot extends Component {
  propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
    config: PropTypes.object
  }

  componentDidMount() {
    draw(this.refs.graph, this.props);
  }

  componentDidUpdate() {
    //const svg = d3.select(this.props.id);
    //svg.remove();
    //draw(this.refs.graph, this.props);
  }

  render() {
    return (
      <div ref="graph"></div>
    )
  }
}

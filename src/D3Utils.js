import * as d3 from "d3";

export function createSvg(graph, id, dimension) {
  const {height, width, margin} = dimension;
  return d3.select(graph).append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('id', id)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
}

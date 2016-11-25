import * as d3 from "d3";

export function AxisX(config, dimension) {
  const {legend, domain, ticks} = config;
  const {height, width, margin} = dimension;

  let scale = d3.scaleLinear()
    .range([0, dimension.width])
    .domain(domain);

  function draw(svg) {
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(scale).ticks(ticks))

    svg.append("text")
      .attr("class", "tex")
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .style("text-anchor", "end")
      .text(legend.title);
  }

  return {
    scale: scale,
    draw: draw
  }
}

export function AxisY(config, dimension) {
  const {legend, domain, ticks} = config;
  const {height, width, margin} = dimension;

  let scale = d3.scaleLinear()
    .range([dimension.height, 0])
    .domain(domain);

  function draw(svg) {

    svg.append("g")
      .attr("transform", `translate(0,0)`)
      .call(d3.axisLeft(scale).ticks(ticks));

    svg.append("text")
      .attr("class", "tex")
      .attr("x", 10)
      .attr("y", 0)
      .style("text-anchor", "start")
      .text(legend.title);
  }

  return {
    scale: scale,
    draw: draw
  }
}

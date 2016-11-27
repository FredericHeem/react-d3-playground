import * as d3 from "d3";

function getScaleType(type){
  let scale = d3.scaleLinear();
  switch(type){
    case 'time': {
      scale = d3.scaleTime()
      break;
    }
    default:{
    }
  };
  return scale;
}

export function AxisX(config, dimension) {
  const {legend, scale: scaleConfig} = config;
  const {domain/*, ticks*/, tickFormat, rotate} = scaleConfig;
  const {height, width, margin} = dimension;

  let scale = getScaleType(scaleConfig.type)
    .range([0, width])
    .domain(domain);

  let axis = d3.axisBottom(scale).tickFormat(tickFormat)

  function draw(svg) {
    const axisSvg = svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(axis);

    if(rotate){
      axisSvg.selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", `rotate(${rotate})`);
    }

    const legendPosition = legend.position || "middle";
    const legendWidth = {"start": 0, "middle": width / 2, "end": width}[legendPosition];

    svg.append("text")
      .attr("class", "tex")
      .attr("x", legendWidth)
      .attr("y", height + margin.top + 40)
      .style("text-anchor", legend.position || "middle")
      .text(legend.title);
  }

  return {
    scale: scale,
    draw: draw
  }
}

export function AxisY(config, dimension) {
  const {legend, scale: scaleConfig} = config;
  const {domain, ticks} = scaleConfig;
  const {height} = dimension;

  let scale = d3.scaleLinear()
    .range([height, 0])
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

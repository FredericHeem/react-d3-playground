//import * as d3 from "d3";

export function computeRateOfReturns(data) {
  let returns = []
  for (let i = 1; i < data.length; i++) {
    const price = data[i].close;
    const priceBefore = data[i - 1].close
    returns.push((price - priceBefore) / priceBefore * 100)
  }
  //console.log(returns)
  //console.log("Min returns ", d3.min(returns))
  //console.log("Max returns ", d3.max(returns))
  return returns;
}

export function instrumentStats({mean1, stddev1}, {mean2, stddev2}, weight1, correlation){
  const weight2 = 1 - weight1;
  const variance = (weight1 * weight1 * stddev1 * stddev1)  +
                   (weight2 * weight2 * stddev2 * stddev2)  +
                   2 * correlation * weight1 * stddev1 * weight2 * stddev2;
  return {
    mean: weight1 * mean1 + weight2 * mean2,
    stdDev: Math.sqrt(variance)
  }
}

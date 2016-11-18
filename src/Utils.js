import * as d3 from "d3";

export function computeRateOfReturns(data) {
  let returns = []
  for (let i = 1; i < data.length; i++) {
    const price = data[i].close;
    const priceBefore = data[i - 1].close
    returns.push((price - priceBefore) / priceBefore * 100)
  }
  //console.log(returns)
  console.log("Min returns ", d3.min(returns))
  console.log("Max returns ", d3.max(returns))
  return returns;
}

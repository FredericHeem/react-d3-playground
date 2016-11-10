import React, { Component } from 'react';
import Chart from './Chart';
import Histogram from './Histogram';
import * as d3 from "d3";
import './App.css';
import './Chart.css'
import './Histogram.css'
const parseTime = d3.timeParse("%Y-%m-%d");

export function parseData(data) {
  data.forEach(function (d) {
    d.date = parseTime(d.Date);
    d.close = +d.Close;
  });
  return data;
}

export function loadData() {
  return new Promise((resolve, reject) => {
    d3.csv("table.csv", function (error, data) {
      //console.log("data loaded ", data.length)
      if (error) reject(error);

      data = parseData(data)
      //console.log("data ", data)
      resolve(data)
    })
  })
}

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const data = await loadData();
    const rateOfReturns = computeRateOfReturns(data)
    this.setState({ data, rateOfReturns })
  }

  render() {
    const {data = [], rateOfReturns = []} = this.state;
    console.log("render ", data);
    const dimension = {
      height: 300,
      width: 500,
      margin: { top: 20, right: 20, bottom: 100, left: 80 }
    }

    return (
      <div>
        <h1>Histogram</h1>
        <Histogram
          data={rateOfReturns}
          dimension={dimension}
          id="d3-histogram"
          />
        <h1>Chart</h1>
        <Chart
          data={data}
          dimension={dimension}
          id="d3-graph"
          />
      </div>
    );
  }
}

export default App;

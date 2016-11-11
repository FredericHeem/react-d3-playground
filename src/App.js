import React, { Component } from 'react';
import * as d3 from "d3";
import Chart from './Chart';
import Histogram from './Histogram';
import './App.css';
import './Chart.css'
import './Histogram.css'
import DataLoader from './DataLoader'

const dataLoader = DataLoader()

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
    const data = await dataLoader.load();
    const rateOfReturns = computeRateOfReturns(data)
    this.setState({ data, rateOfReturns })
  }

  render() {
    const {data = [], rateOfReturns = []} = this.state;
    console.log("render ", data);
    const dimension = {
      height: 300,
      width: 600,
      margin: { top: 20, right: 20, bottom: 100, left: 80 }
    }

    return (
      <div className='diagram-container'>
        <div className='diagram'>
          <h1>Histogram</h1>
          <Histogram
            data={rateOfReturns}
            dimension={dimension}
            id="d3-histogram"
            />
        </div>
        <div className='diagram'>
          <h1>Chart</h1>
          <Chart
            data={data}
            dimension={dimension}
            id="d3-graph"
            />
        </div>
      </div>
    );
  }
}

export default App;

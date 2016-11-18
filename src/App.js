import React, { Component } from 'react';
import Chart from './Chart';
import Histogram from './Histogram';
import ScatterPlot from './ScatterPlot'
import './App.css';
import './Chart.css'
import './Histogram.css'
import returnStdDev from './data/return-stddev'
import DataLoader from './DataLoader'
import {computeRateOfReturns} from './Utils';

const dataLoader = DataLoader()

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
          <h1>Scatter Plot</h1>
          <ScatterPlot
            data={returnStdDev}
            dimension={dimension}
            config={{
              axis: {
                x: {
                  title: "Standard deviation of return (%)",
                  domain: [0, 30]
                },
                y: {
                  title:'Expected return (%)',
                  domain: [0, 18]
                }
              }
            }}
            id="d3-scatterplot"
            />
        </div>
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

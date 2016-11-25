import React, { Component } from 'react';
//import {InlineMath} from 'react-katex';
//import KaTeX from 'katex';
//import 'katex/dist/katex.min.css';

import Chart from './Chart';
import Histogram from './Histogram';
import ScatterPlot from './ScatterPlot'
import './App.css';
import './Chart.css'
import './Histogram.css'
import returnStdDev from './data/return-stddev'
import DataLoader from './DataLoader'
import {computeRateOfReturns} from './MathUtils';

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
    //console.log("render ", data);
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
            config={{
              dimension,
              axis: {
                x: {
                  scale: 'linear',
                  ticks: 5,
                  domain: [0, 30],
                  legend: {
                    title: "Standard deviation (%)"
                  },
                },
                y: {
                  scale: 'linear',
                  legend: {
                    title:'Expected return (%)'
                  },
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
            id="d3-histogram"
            data={rateOfReturns}
            config={{
              dimension,
              axis: {
                x: {
                  title: "Rate Of Return (%)"
                },
                y: {
                  title: "Frequency (%)"
                }
              }
            }}

            />
        </div>
        <div className='diagram'>
          <h1>Chart</h1>
          <Chart
            data={data}
            id="d3-graph"
            config={{
              dimension,
              axis: {
                x: {
                  title: "Date"
                },
                y: {
                  title:'Price ($)'
                }
              }
            }}
            />
        </div>



      </div>
    );
  }
}

export default App;

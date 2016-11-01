import React, { Component } from 'react';
import Chart from './Chart';
import * as d3 from "d3";
import './App.css';

function loadData() {
  const parseTime = d3.timeParse("%Y-%m-%d");

  return new Promise((resolve, reject) => {
    d3.csv("data.csv", function (error, data) {
      console.log("data loaded ", data.length)
      if (error) reject(error);

      data.forEach(function (d) {
        d.date = parseTime(d.Date);
        d.close = +d.Close;
      });
      //console.log("data ", data)
      resolve(data)
    })
  })
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { percentComplete: 0.3 };
  }

  async componentDidMount() {
    const data = await loadData();
    this.setState({data})
  }

  render() {
    const {data = []} = this.state;
    console.log("render ", data);
    const dimension = {
      height: 400,
      width: 800,
      margin: {top: 20, right: 20, bottom: 100, left: 80}
    }

    return (
      <div>
        <h1>Chart</h1>
        <Chart
          data={data}
          dimension={dimension}
          id="d3-graph"
          backgroundColor="#e6e6e6"
          foregroundColor="#00ff00"
          />
      </div>
    );
  }
}

export default App;

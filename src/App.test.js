import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import assert from 'assert'
import ohlc from '../public/ohlc.json'
import math from 'mathjs'
import DataLoader from './DataLoader'
import {computeRateOfReturns} from './MathUtils';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('data', () => {
  let data;
  const dataLoader = DataLoader()
  beforeEach(async () => {
    data = dataLoader.parse(ohlc)
    assert(data)
  });

  it('computeRateOfReturns', async () => {
    console.log("#data ", data.length)
    const rateOfReturns = computeRateOfReturns(data)
    assert(rateOfReturns)
    console.log("#rateOfReturns ", rateOfReturns.length)
    const quantile = math.quantileSeq(rateOfReturns, 0.025);
    console.log("quantile 0.025", quantile)
    console.log("quantile 0.01 ", math.quantileSeq(rateOfReturns, 0.01))
    console.log("quantile 0.5", math.quantileSeq(rateOfReturns, 0.5))
    console.log("quantile 0.975", math.quantileSeq(rateOfReturns, 0.975))
  });
  it('quantile', () => {
    //const returns = [[-10, -5, 0, 5, 10]

  });
});


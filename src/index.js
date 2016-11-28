import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
//import MathJaxSupport from './MathJaxSupport';

const debug = require("debug");
debug.disable();

async function init() {
  /*const mathJaxSupport = MathJaxSupport()
  console.log("mathjax init")
  await mathJaxSupport.init();
  console.log("mathjax done")
  */
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

init()

import * as d3 from "d3";

export default () => {
  const parseTime = d3.timeParse("%Y-%m-%d");

  function parse(data) {
    data.forEach(function (d) {
      d.date = parseTime(d.Date);
      d.close = +d.Close;
    });
    return data;
  }

  function load() {
    return new Promise((resolve, reject) => {
      d3.csv("table.csv", function (error, data) {
        //console.log("data loaded ", data.length)
        if (error) reject(error);

        data = parse(data)
        //console.log("data ", data)
        resolve(data)
      })
    })
  }

  return {
    parse,
    load
  }
}

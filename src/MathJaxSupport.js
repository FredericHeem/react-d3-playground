//import 'mathjax'
/* eslint no-undef: 0  */
import * as d3 from "d3";

export function processTex(svg, selector) {
  //console.log("processTex ", selector)
  MathJax.Hub.Register.StartupHook("End", function () {
    console.log("StartupHook done ")
    setTimeout(() => {
      svg.selectAll(selector).each(function () {
        const self = d3.select(this);
        const g = self.select('text>span>svg');
        const groups = g._groups;
        if (groups && groups[0] && groups[0][0] && groups[0][0].tagName === 'svg') {
          g.remove();
          self.append(function () {
            return g.node();
          });
        } else {
          console.log("no node")
        }
      });

    }, 400);
  });

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, svg.node()]);
}

export default () => {
  return {
    async init() {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log("MathJax.Hub.Config")
          MathJax.Hub.Config({
            tex2jax: {
              inlineMath: [['$', '$'], ["\\(", "\\)"]],
              processEscapes: true
            }
          });

          MathJax.Hub.Register.StartupHook("End", function () {
            console.log("StartupHook end")
            resolve({})
          });
        }, 1);
      })
    }
  }

}

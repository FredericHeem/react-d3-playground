//import 'mathjax'
/* eslint no-undef: 0  */
import * as d3 from "d3";
import MathJax_ from 'mathjax'
import Promise from 'es6-promise'

function cleanEscapesForTex(s) {
    return s.replace(/(<|&lt;|&#60;)/g, '\\lt ')
        .replace(/(>|&gt;|&#62;)/g, '\\gt ');
}

export function texToSVG(_texString, config) {
    var randomID = 'math-output-' + 'TODORANDOMSTRING';
    var tmpDiv = d3.select('body').append('div')
        //.attr({id: randomID})
        //.style({visibility: 'hidden', position: 'absolute'})
        //.style({'font-size': config.fontSize + 'px'})
        .text(cleanEscapesForTex(_texString));

    console.log("texToSVG ", _texString)
    return new Promise((resolve, reject) => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, tmpDiv.node()], function () {
        console.log("MathJax.Hub.Queue done ")
        console.log("selecting : MathJax_SVG_glyphs")
        var glyphDefs = d3.select('body').select('#MathJax_SVG_glyphs');
        console.log("glyphDefs:", glyphDefs)
        if (tmpDiv.select('.MathJax_SVG').empty() || !tmpDiv.select('svg').node()) {
          console.log('There was an error in the tex syntax.', _texString);
          reject({
            message: 'There was an error in the tex syntax.',
            texString,
          })
        }
        else {
          var svgBBox = tmpDiv.select('svg').node().getBoundingClientRect();
          console.log("svgBBox:", svgBBox)
          resolve(tmpDiv.select('.MathJax_SVG'), glyphDefs, svgBBox);
        }

        tmpDiv.remove();
      });
    })

}

export function processTex(svg, selector) {
  //console.log("processTex ", selector)
  MathJax.Hub.Register.StartupHook("End", function () {
    console.log("StartupHook done ")
    setTimeout(() => {
      svg.selectAll(selector).each(function () {
        const self = d3.select(this);
        const g = self.select('text>span>svg');
        const groups = g._groups;
        console.log("groups: ", groups);
        if (groups && groups[0] && groups[0][0] && groups[0][0].tagName === 'svg') {
          g.remove();
          console.log("removing: ", g);
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

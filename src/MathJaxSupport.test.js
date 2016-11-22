import MathJaxSupport, { texToSVG } from './MathJaxSupport';
import assert from 'assert'

const config = {
  fontSize: 12
}

async function init() {
  const mathJaxSupport = MathJaxSupport()
  console.log("mathjax init")
  await mathJaxSupport.init();
  console.log("mathjax initialized")
}

describe('MathJax', () => {
  beforeEach(() => {
    //return init()
  });

  describe('text2SVG', () => {
    it('$\\sigma$', async () => {
      await init()
      const texInput = '$\\sigma$';
      const node = await texToSVG(texInput, config)
      assert(node);
    });
  });

});


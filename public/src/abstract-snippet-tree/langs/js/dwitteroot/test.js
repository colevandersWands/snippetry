import { describe, it, expect } from '../../../../../../snippets/testing.mjs';

import { compress } from './compress.js';
import { uncompress } from './uncompress.js';

describe('compressing and uncompressing dweets', () => {
  it('should compress code', () => {
    expect(compress('const x = 3;')).toEqual(
      "eval(unescape(escape`󨽯󫭳󭌠󮌠󟜠󜼻`.replace(/u../g,'')))",
    );
  });
  it('should uncompress code', () => {
    expect(uncompress("eval(unescape(escape`󨽯󫭳󭌠󮌠󟜠󜼻`.replace(/u../g,'')))")).toEqual(
      'const x = 3;',
    );
  });
  it('should be one identity', () => {
    expect(uncompress(compress('const x = 3;'))).toEqual('const x = 3;');
  });
  it('should be the other identity', () => {
    expect(
      compress(uncompress("eval(unescape(escape`󨽯󫭳󭌠󮌠󟜠󜼻`.replace(/u../g,'')))")),
    ).toEqual("eval(unescape(escape`󨽯󫭳󭌠󮌠󟜠󜼻`.replace(/u../g,'')))");
  });
});

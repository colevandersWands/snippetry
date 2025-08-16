import { flatEarth } from './flat-earth.mjs';
import { withify } from './withify.mjs';

withify(flatEarth)(() => {
  log('');
  push(1);
});

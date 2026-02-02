import { flatEarth } from './flat-earth.draft-4.mjs';
import { withify } from './withify.mjs';

withify(flatEarth)(() => consoleLog('yes, it is'));

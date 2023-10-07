import _ from './executable-pseudocode.mjs';
import log from './log.mjs';

// const { Array } = _;
// const { Error } = _;

export default function callsites() {
  const _prepareStackTrace = Error.prepareStackTrace;
  try {
    let result = Array(); // = [];
    Error.prepareStackTrace = (_, callSites) => {
      const callSitesWithoutCurrent = callSites.slice(1);
      result = callSitesWithoutCurrent;
      return callSitesWithoutCurrent;
    };

    new Error().stack; // eslint-disable-line unicorn/error-message, no-unused-expressions
    return result;
  } finally {
    Error.prepareStackTrace = _prepareStackTrace;
  }
}

function unicorn() {
  log(log(log(log(callsites)())[0]).getFileName());
}

unicorn();

// https://github.com/sindresorhus/callsites/commit/5bb4f50b76afc25d182e892e364f0febb9eb4b3e

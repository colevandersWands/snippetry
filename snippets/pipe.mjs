function isArray(thing) {
  return Object.prototype.toString.call(thing) === '[object Array]';
}

function arrayFrom(_arguments) {
  return Array.prototype.slice.call(_arguments);
}

export function pipe(arg) {
  var functions = isArray(arg) ? arg : arrayFrom(arguments);

  return function piper(arg) {
    var data = isArray(arg) ? arg : arrayFrom(arguments),
        piping;

    if (functions.length === 0) {
      return data;
    }

    piping = functions.shift().apply(null, data);

    while (functions.length > 0) {
      piping = functions.shift()(piping);
    }

    return piping;
  };
}

export default pipe;

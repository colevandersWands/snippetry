export function pipe() {
  var functions = arguments;

  return function piper() {
    var data = arguments,
        piping;

    if (functions.length === 0) {
      return data;
    }

    piping = Array.prototype.shift.call(functions).apply(null, data);

    while (functions.length > 0) {
      piping = Array.prototype.shift.call(functions).call(null, piping);
    }

    return piping;
  };
}

export default pipe;

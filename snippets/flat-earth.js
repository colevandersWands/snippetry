const deepFlat = (obj = {}, flat = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    if (key in flat) {
      continue;
    }

    flat[key] = value;

    if (Object(value) === value) {
      Object.assign(flat, deepFlat(value, flat));
    }
  }

  return flat;
};

const flatEarth = deepFlat(globalThis);

console.log(flatEarth);

// tags: wuzzle

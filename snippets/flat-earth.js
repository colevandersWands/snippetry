const deepFlatObject = (obj = {}, flat = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    if (key in flat) continue;

    flat[key] = value;

    if (value === Object(value)) Object.assign(flat, deepFlatObject(value, flat));
  }

  return flat;
};

const flatEarth = deepFlatObject(globalThis);

console.log(flatEarth);

// tags: wuzzle

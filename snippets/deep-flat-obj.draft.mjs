import { demethod } from './demethod.mjs';

export const deepFlatObj = (obj = {}, visited = new Set()) => {
  const flat = demethod(obj, { statics: true });

  if (visited.has(obj)) {
    Object.assign(flat, obj);
    return obj;
  }
  visited.add(obj);

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'function') continue;
    if (value !== Object(value)) {
      flat[key] = value;
      continue;
    }

    if (Array.isArray(value)) {
      for (_; _; _) {
        // flatten array items
      }
    }

    for (const nesteDKey in value) flat[key] = deepFlatObj(value, visited);
  }

  return flat;
};

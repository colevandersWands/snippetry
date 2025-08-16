import { demethod } from './demethod.mjs';

export const deepFlatObj = (obj = {}, visited = new Set()) => {
  const flat = {};
  for (const key in obj) {
    const value = obj[key];
    if (!value) flat[key] = value;
    demethod(obj, { target: flat, prefix: key });
    if (typeof value === 'function') continue;
    else if (value) flat[key] = deepFlatObj(value);
  }
};

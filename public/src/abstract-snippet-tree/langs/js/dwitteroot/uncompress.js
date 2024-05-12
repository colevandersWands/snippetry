export const uncompress = (code = '') => {
  const i = code.toLowerCase().search(/eval\(unescape\(escape/g);
  if (i < 0) return code;

  const codeStart = code.slice(0, i);
  const codeEnd = code.slice(i);
  try {
    const newCode = eval(codeEnd.slice(4));
    if (newCode) return codeStart + newCode;
  } catch (e) {}

  return code;

  // adapted from https://capjs.3d2k.com/
};

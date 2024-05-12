export const compress = (code = '') => {
  // replace unicode characters
  const codeIn = [...code];
  let uniCode = '';
  for (let character of codeIn) {
    const charCode = character.charCodeAt(0);
    if (charCode > 255) character = escape(character).replace(/%u/g, '\\u');
    uniCode += character;
  }

  // 2-1 character compression
  let dwitterCompressed = String.fromCharCode(
    ...[...(uniCode.length % 2 ? uniCode + ';' : uniCode)].map(
      (e, i) => e.charCodeAt() | (i % 2 ? 0xdf00 : 0xdb00),
    ),
  );

  return 'eval(unescape(escape`' + dwitterCompressed + "`.replace(/u../g,'')))";

  // adapted from https://capjs.3d2k.com/
};

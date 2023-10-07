// see ../generated

/*
  reads JSON files as code
  supports?
    list
    func, def
    while, if
    log, alert, prompt, confirm

  make a function for each operator
    all operators must be nary
*/

const env = {};

const run = (p = []) => {};

/**
 *
 * @param {String | Array} p the lispy program to execute
 *  String -> use as a URL to fetch & parse JSON
 *  Array -> execute array as a program
 */
export const lispy = async (p) => {
  p = Array.isArray(c) ? p : await fetch(p).then((r) => r.json);
};

export default lispy;

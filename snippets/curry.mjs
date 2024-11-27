export const curry = (fn, arity = fn.length, all = []) =>
  function currying(...next) {
    all.push(...next);
    return all.length >= arity ? fn(...all) : currying;
  };

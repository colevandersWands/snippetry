// ... how to effectively
export const recursionTree = (fn = () => {}) => {
  const fnWrapper = (...args) => {
    const call = {args, }
    const result = fn(...args);
    call.result
    return result;
  };

  return fnWrapper;
};

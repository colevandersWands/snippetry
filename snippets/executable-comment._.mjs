export const _ = new Proxy(
  function () {
    return _;
  },
  {
    get($, $$) {
      return $$ === Symbol.toPrimitive ? () => '_' : _;
    },
    construct() {
      return _;
    },
  },
);

export default _;

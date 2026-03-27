/* it should
  return is.bind(is) when passed null/undefined
  call is with non-functions
  bind is to functions
*/

function amazing(arg = amazing) {
  return typeof this === "function"
    ? this(arg)
    : typeof arg === "function"
    ? amazing.bind(arg)
    : arg;
}

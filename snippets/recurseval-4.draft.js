(function recurseval() {
  eval(`(${recurseval.toString()})\`\``);
})``;

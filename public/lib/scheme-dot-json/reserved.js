import { environment } from "./environment.js";

export const reserved = {
  if: "if",
  cond: "cond",
  else: "else",
  define: "define",
  comment: ";",
  commentProgram: ";;",
  pipeLog: "*log",
  debug: "*debug",
  list: "list",
  ...Object.keys(environment).reduce(
    (all, next) => ({ ...all, [next]: environment[next] }),
    {}
  ),
};

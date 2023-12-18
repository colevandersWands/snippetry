import { expect } from './expect.mjs';

export class Quizzert {
  static expect = expect;

  constructor(questions = {}) {}
}

export default Quizzert;

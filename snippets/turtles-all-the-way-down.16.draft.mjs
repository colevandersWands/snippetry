import { expect, it } from './testing.mjs';

const turtle = Object.defineProperty({}, '🐢', { get: () => turtle });

(function down() {
  it('is turtles all the way ...', () => down());
})();

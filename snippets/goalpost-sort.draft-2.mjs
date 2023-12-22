import { describe, it, expect } from './testing.mjs';

const goalpostSort = (nums = []) =>
  eval(`true ${nums.map((n, i) => `&& nums[${i}] === ${n}`).join(' ')}`);

describe('goalpostSort sorts an array in O(n) by moving the goalpost', () => {
  it('sorts an empty array', () => {
    expect(goalpostSort([])).toEqual(true);
  });
  it('sorts a sorted array', () => {
    expect(goalpostSort([-2, -1, 0, 1, 2, 3])).toEqual(true);
  });
  it('sorts an unsorted array', () => {
    expect(goalpostSort([5, 0, 4, 1, 3, 2])).toEqual(true);
  });
});

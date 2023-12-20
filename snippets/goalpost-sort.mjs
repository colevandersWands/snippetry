import { describe, it, expect } from './testing.mjs';

export const goalpostSort = (nums = []) =>
  new Function(
    `nums=[${nums.join(',')}]`,
    `return true ${nums.map((n, i) => `&& nums[${i}] === ${n}`).join(' ')};`,
  );

describe('goalpostSort sorts an array in 1 operation by moving the goalpost', () => {
  it('returns a custom goalpost for arbitrary arrays', () => {
    const isSorted = goalpostSort([3, 2, 1]);
    expect(typeof isSorted).toEqual('function');
  });
  it('sorts an empty array', () => {
    const isSorted = goalpostSort([]);
    expect(isSorted([])).toEqual(true);
  });
  it('sorts a sorted array', () => {
    const isSorted = goalpostSort([-2, -1, 0, 1, 2, 3]);
    expect(isSorted([-2, -1, 0, 1, 2, 3])).toEqual(true);
  });
  it('sorts an unsorted array', () => {
    const isSorted = goalpostSort([5, 0, 4, 1, 3, 2]);
    expect(isSorted([5, 0, 4, 1, 3, 2])).toEqual(true);
  });
  it('sorts the correct array by default', () => {
    const isSorted = goalpostSort([5, 0, 4, 1, 3, 2]);
    expect(isSorted()).toEqual(true);
  });
  it('does not sort the wrong array', () => {
    const isSorted = goalpostSort([5, 0, 4, 1, 3, 2]);
    expect(isSorted([3, 2, 7])).toEqual(false);
  });
});

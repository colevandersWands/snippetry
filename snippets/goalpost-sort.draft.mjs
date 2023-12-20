import { describe, it, expect } from './testing.mjs';

export const goalpostSort = (nums = [], goalpost = 'true') => {
  if (nums.length == 0) {
    return eval(`(nums=[]) => ${goalpost}`);
  } else {
    return goalpostSort(
      nums.slice(0, nums.length - 1),
      `nums[${nums.length - 1}] === ${nums[nums.length - 1]} && ${goalpost}`,
    );
  }
};

describe('goalpostSort sorts an array in O1 by moving the goalpost', () => {
  it('returns a custom goalpost for arbitrary arrays', () => {
    const isSorted = goalpostSort([3, 2, 1]);

    expect(isSorted.toString()).toEqual(
      '(nums=[]) => nums[0] === 3 && nums[1] === 2 && nums[2] === 1 && true',
    );
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
});

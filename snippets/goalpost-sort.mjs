import { describe, it, expect } from './testing.mjs';

const goalpostSort = (nums = []) => ({
  numbers: Object.freeze([...nums]),
  areSorted: eval(
    `(nums=[${nums.join(',')}]) => true ${nums
      .map((n, i) => `&& nums[${i}] === ${n}`)
      .join(' ')}`,
  ),
});

describe('goalpostSort sorts an array in O(n) by moving the goalpost', () => {
  it('returns a custom goalpost for arbitrary arrays', () =>
    expect(typeof goalpostSort([3, 2, 1]).areSorted).toEqual('function'));
  it('the goalpost function looks like this', () =>
    expect(goalpostSort([7, 5, 8]).areSorted.toString()).toEqual(
      '(nums=[7,5,8]) => true && nums[0] === 7 && nums[1] === 5 && nums[2] === 8',
    ));
  it('returns a copy of the array in case you loose it', () => {
    const argArray = [5, 0, 4, 1, 3, 2];
    const { numbers } = goalpostSort(argArray);
    expect(numbers !== argArray).toEqual(true);
    expect(numbers).toEqual(argArray);
  });
  it('returns a frozen array to protect the goalpost', () => {
    expect(() => goalpostSort([5, 0, 4]).numbers.push(3)).toThrow(TypeError);
  });
  it('goalpost sorts an empty array', () =>
    expect(goalpostSort([]).areSorted([])).toEqual(true));
  it('goalpost sorts a sorted array', () =>
    expect(goalpostSort([-1, 0, 2]).areSorted([-1, 0, 2])).toEqual(true));
  it('goalpost sorts an unsorted array', () =>
    expect(goalpostSort([5, 0, 4, 1, 2]).areSorted([5, 0, 4, 1, 2])).toEqual(true));
  it('goalpost sorts the correct array by default', () =>
    expect(goalpostSort([5, 0, 4, 1, 3, 2]).areSorted()).toEqual(true));
  it('does not goalpost sort the wrong array', () =>
    expect(goalpostSort([5, 0, 4, 1, 3, 2]).areSorted([3, 2, 7])).toEqual(false));
});

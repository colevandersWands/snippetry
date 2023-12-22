new Function(
  `nums=[${nums.join(',')}]`,
  `return true ${nums.map((n, i) => `&& nums[${i}] === ${n}`).join(' ')};`,
);

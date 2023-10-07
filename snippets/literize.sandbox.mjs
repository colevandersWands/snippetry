import literize from './literize.mjs';

const evenNumbers = [2, 4, 6, 8, 10];
const addOne = (x) => x + 1;

const oddNumbers = literize(
  (nums, mapper) => nums.map(mapper),
  [2, 1],
)`Using the function ${addOne},
	we will convert this array of ${evenNumbers} 
	to an array of odd numbers`;

console.log(oddNumbers);

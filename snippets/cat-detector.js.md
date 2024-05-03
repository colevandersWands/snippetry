# Cat Detector

On the surface, a cat detector is a just simple program:

- First it asks you for a cat:
  ```js
  let input = prompt('cat, please');
  ```
- Then it checks if you gave it a cat:
  ```js
  const isCat = input === 'cat';
  ```
- If did give it a cat, the detector is satisfied:
  ```js
  if (isCat) alert('thank you for the cat');
  ```
- Otherwise it keeps asking you for a cat until you give it one:
  ```js
  else {
  	while (input !== 'cat') input = prompt('still not a cat. \n\ncat, please');
  ```
- When you're done out-stubborning a computer, the program ends:
  ```js
  	alert('finally, a cat.');
  }
  ```

But really, a cat detector is an excuse to [draw a bunny](./bunny.md).

<!-- tags: variations, metappet -->

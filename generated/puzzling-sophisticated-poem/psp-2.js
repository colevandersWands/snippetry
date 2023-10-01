// Once upon a time, in a land of code,
// A variable named 'dreams' was bestowed.
let dreams = [];

// With each passing day, new dreams were found,
// And into the array, they were tightly bound.
dreams.push('love');
dreams.push('adventure');
dreams.push('success');

// But the dreams were restless, they wanted to roam,
// So they broke free and found a new home.
let newDreams = dreams.splice(0, dreams.length);

// The old dreams were gone, but not forgotten,
// In a new variable, their memory was begotten.
let forgottenDreams = newDreams;

// But the forgotten dreams were not content,
// They yearned to be remembered, to be present.
forgottenDreams.forEach((dream) => {
  console.log('Remember me: ' + dream);
});

// And so the dreams lived on, in memory and thought,
// A reminder of the battles fought.


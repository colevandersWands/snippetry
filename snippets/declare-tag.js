/* --- tag: it's value is it's name as a string ---

	read-only

	errors at creation-phase
		if it is initialized
		if the variable is (re)assigned
		
*/

// tag potato = 1; // SyntaxError: tag potato cannot be initialized

tag potato;

alert(`potato${potato}`); // potatopotato

console.log(potato === 'potato'); // true

// potato += '!'; // SyntaxError: tag potato cannot be assigned


// tags: ESi
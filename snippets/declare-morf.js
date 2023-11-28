/* --- morf: a variable that must be reassigned ---

	errors at creation-phase if the variable is not reassigned
	it can be declared without initialization 

*/

morf a; 

a = 1;

a += 1;

morf b = a + 1 // SyntaxError: morf b is never reassigned

console.log(b); // never executed

// tags: ESi
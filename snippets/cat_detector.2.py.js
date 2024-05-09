maybe_a_cat = prompt('please enter "cat": ')

while (maybe_a_cat?.toLowerCase() != "cat") 
    maybe_a_cat = prompt('not a cat, try again: ')

alert('thank you for the cat')
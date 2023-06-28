const alert = (thing) => (window.alert(thing?.toString()), thing);

alert('a' + alert('l' + alert('e' + alert('r' + alert('t')))));

// tags: useless

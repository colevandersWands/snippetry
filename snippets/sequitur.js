const sequitur = (non = '') => (non ? { [non]: sequitur } : sequitur);

console.log('non' + sequitur('hi').hi('bye').bye().name);

// tags: useless, wuzzle

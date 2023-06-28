const sequitur = (non = '') => (non ? { [non]: sequitur } : sequitur);

console.log(sequitur('hi').hi('bye').bye()('sequitur').sequitur.name);

// tags: useless, puzzle

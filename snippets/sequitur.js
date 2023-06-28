const sequitur = (non = '') => (non ? { [non]: sequitur } : sequitur);

alert(sequitur('hi').hi('bye').bye()('sequitur').sequitur.name);

// tags: useless, puzzle

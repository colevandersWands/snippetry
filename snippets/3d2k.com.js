let s = ' ', z = ['▲'];
eval("z=z.map(x=>s+x+s).concat(z.map(x=>x+' '+x));s+=s;".repeat(3));
throw `\n` + z.join`\n`;
window.open('https://generative.3d2k.com');

// credit: https://3d2k.com/

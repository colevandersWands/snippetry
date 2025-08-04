// TODO slower than the html, dots don't have tail, too large when compressed

x.fillStyle = 'rgba(0,0,0,.1)';
x.fillRect(0, 0, 1920, 1080);
for (i = 0; i < 100; i++) {
  a = i * 0.3 + t * 0.02;
  r = i * 2 + S(t * 0.01 + i * 0.1) * 20;
  x.fillStyle = `hsl(${(i * 3 + t * 60) % 360}, 70%, 60%)`;
  x.beginPath();
  x.arc(960 + C(a) * r, 540 + S(a) * r, 3, 0, 7);
  x.fill();
}

// tags: coAIthored
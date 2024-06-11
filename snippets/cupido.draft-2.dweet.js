hX = 935;
hY = 520;

onmousemove = (e) => {
  x.clearRect(0, 0, c.width, c.height);

  aX = (e.clientX / innerWidth) * 1920;
  aY = (e.clientY / innerHeight) * 1080;

  Math.round(aX / 10) == 93 && Math.round(aY / 10) == 52
    ? x.fillText('💘', hX, hY)
    : (x.fillText('🏹', aX, aY), x.fillText('💖', hX, hY));
};

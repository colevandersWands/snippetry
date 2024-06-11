C = c.getBoundingClientRect();

onmousemove = (e) => {
  t = c.width / 2;
  i = c.height / 2;
  l = C.left + (C.right - C.left) / 2;
  n = C.top + (C.bottom - C.top) / 2;
  h = e.clientX - l;
  o = e.clientY - n;
  p = (_, a, b, c) => 0 == Math.round((_ * (_ < 0 ? a / b : (c - a) / b)) / 10);
  q = (a, b, c, d, e) => (a < 0 ? (b / c) * d : 2 * d - ((e - b) / (e - c)) * d);

  x.clearRect(0, 0, 2 * t, 2 * i);

  p(h, l, t, innerWidth) && p(o, n, i, innerHeight)
    ? x.fillText('💘', t, i)
    : (x.fillText(
        '🏹',
        q(h, e.clientX, l, t, innerWidth),
        q(o, e.clientY, n, i, innerHeight),
      ),
      x.fillText('💖', t, i));
};

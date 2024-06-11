/* todo: golfing

  merge logic for calculating overlap and rendering bow

*/

C = c.getBoundingClientRect();
x.f = x.fillText;

onmousemove = ({ clientX: X, clientY: Y }) => {
  t = c.width / 2;
  i = c.height / 2;
  l = C.left + (C.right - C.left) / 2;
  n = C.top + (C.bottom - C.top) / 2;
  p = (a, b, c, d) => !Math.round((a * (a < 0 ? b / c : (d - b) / c)) / 10);
  q = (a, b, c, d, e) => (a < 0 ? (b / c) * d : 2 * d - ((e - b) / (e - c)) * d);

  W = innerWidth;
  H = innerHeight;

  x.clearRect(0, 0, 2 * t, 2 * i);

  p(X - l, l, t, W) && p(Y - n, n, i, H)
    ? x.f('💘', t, i)
    : (x.f('🏹', q(X - l, X, l, t, W), q(Y - n, Y, n, i, H)), x.f('💖', t, i));
};

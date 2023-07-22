export default function turtlje(c = document.createElement('canvas')) {
  c = typeof c === 'string' ? document.getElementById(c) : c;
  const pad = c.getContext('2d');

  const s = { col: 'black', width: 1, deg: 0, x: c.width / 2, y: c.height / 2 };

  const turtle = {
    backward: (pixels) => forward(-pixels),
    color: (col) => ((s.col = col), turtle),
    dot: (diameter) => (
      pad.beginPath(),
      pad.arc(s.x, s.y, diameter / 2, 0, 2 * Math.PI),
      (pad.fillStyle = s.col),
      (pad.lineWidth = s.width),
      pad.fill(),
      turtle
    ),
    forward: (pixels) => (
      pad.beginPath(),
      pad.moveTo(s.x, s.y),
      pad.lineTo(
        (s.x += -Math.cos((s.deg / 180) * Math.PI) * pixels),
        (s.y += -Math.sin((s.deg / 180) * Math.PI) * pixels),
      ),
      (pad.strokeStyle = s.col),
      (pad.lineWidth = s.width),
      pad.stroke(),
      turtle
    ),
    goto: (x, y) => ((s.x = x + c.width / 2), (s.y = y + c.height / 2), turtle),
    left: (deg) => turtle.right(-deg),
    right: (deg) => ((s.deg = (deg + s.deg) % 360), turtle),
    width: (pixels) => ((s.width = pixels), turtle),
  };

  return { ...turtle, state: s, pad };
}

// tags: minibrary

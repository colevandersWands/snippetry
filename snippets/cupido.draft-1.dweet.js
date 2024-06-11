/*
		render a thematic emoji (dot) in the middle of the canvas
		render a mouse emoji in the canvas relative to where the actual mouse is on the screen

		when the user moves the mouse anywhere on the screen, the scaledown mouse moves relative to the dot
		so as the user moves their mouse towards the dot, the mirrormouse does too
		until they both touch the dot at the same time
	*/

hX = 935;
hY = 520;

onmousemove = (e) => {
  x.clearRect(0, 0, c.width, c.height);

  el = c.getBoundingClientRect();

  cCenterX = (el.bottom - el.top) / 2;
  cCenterY = (el.right - el.left) / 2;

  xScale = innerWidth / 1920;
  yScale = innerHeight / 1080;
  console.log(xScale, yScale);

  aX = (e.clientX / innerWidth) * 1920;
  aY = (e.clientY / innerHeight) * 1080;

  Math.round(aX / 10) == 93 && Math.round(aY / 10) == 52
    ? x.fillText('💘', hX, hY)
    : (x.fillText('🏹', aX, aY), x.fillText('💖', hX, hY));
};

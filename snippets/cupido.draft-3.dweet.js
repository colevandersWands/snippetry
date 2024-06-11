el = c.getBoundingClientRect();

onmousemove = (e) => {
  x.clearRect(0, 0, c.width, c.height);

  hCW = c.width / 2;
  hCH = c.height / 2;

  cCenterX = el.left + (el.right - el.left) / 2;
  cCenterY = el.top + (el.bottom - el.top) / 2;

  mX = e.clientX - cCenterX;
  mY = e.clientY - cCenterY;

  scaleXLeft = cCenterX / hCW;
  scaleXRight = (innerWidth - cCenterX) / hCW;
  scaleYTop = cCenterY / hCH;
  scaleYBottom = (innerHeight - cCenterY) / hCH;

  mXAdjusted = mX * (mX < 0 ? scaleXLeft : scaleXRight);
  mYAdjusted = mY * (mY < 0 ? scaleYTop : scaleYBottom);

  hit = Math.round(mXAdjusted / 10) == 0 && Math.round(mYAdjusted / 10) == 0;

  if (hit) {
    x.fillText('💘', hCW, hCH);
  } else {
    bX =
      mX < 0
        ? (e.clientX / cCenterX) * 960
        : 1920 - ((innerWidth - e.clientX) / (innerWidth - cCenterX)) * 960;
    bY =
      mY < 0
        ? (e.clientY / cCenterY) * 540
        : 1080 - ((innerHeight - e.clientY) / (innerHeight - cCenterY)) * 540;

    x.fillText('🏹', bX, bY);
    x.fillText('💖', hCW, hCH);
  }
};

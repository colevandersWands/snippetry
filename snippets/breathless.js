(function breathless(slowness = 500, slowerness = 1.01) {
  const breath = setTimeout(breathless, (slowness *= slowerness), slowness);
  console.log(['hold', 'breath in', 'hold', 'breath out'][breath % 4]);
})();

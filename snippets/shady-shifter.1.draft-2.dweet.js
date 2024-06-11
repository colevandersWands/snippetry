c.onmousemove = e => o = e.clientX
r = c.getBoundingClientRect()
c.style.background = R(t*7%255, t*13%255, t*17%255, ((o-r.left)/1080)*1.8)
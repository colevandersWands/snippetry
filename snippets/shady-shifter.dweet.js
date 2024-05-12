t||(d=h=1,o=540)
c.onmousemove=e=>o=e.clientX
c.onclick=_=>d=!d
h=d?t:h
c.style.background=R(h*7%255,h*13%255,h*17%255,((o-c.getBoundingClientRect().left)/1080))
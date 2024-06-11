c.onmousemove=e=>{a=e.clientX;b=e.clientY}
r=c.getBoundingClientRect()
h=(a-r.left)/1920*255*3
c.style.background=R((h+t)%255,(h-t)%255,(h*t)%255,(b-r.top)/1080*3)
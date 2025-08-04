C=c.getBoundingClientRect()
x.f=x.fillText
onmousemove=e=>{
  t=c.width/2
  i=c.height/2
  h={x:C.left+t,y:C.top+i}
  X=t+(e.clientX-h.x)*(t/innerWidth)
  Y=i+(e.clientY-h.y)*(i/innerHeight)
  x.clearRect(0,0,2*t,2*i)
  d=Math.hypot(X-t,Y-i)<20
  x.f(d?'💘':(x.f('🏹',X,Y),'💖'),t,i)
}

// tags: coAIthored

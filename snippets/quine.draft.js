// !! so far mostly "weak" quines, since they rely on the engine storing a function's source

// ? testing quines ?

// from beautify javascript
(function f() { console.log('(' + f.toString() + ')()') })()

;

// https://catonmat.net/quine-in-node
(function f() {
  console.log('(' + f.toString() + ')()');
})();

// https://catonmat.net/quine-in-node
function quine() {
  console.log(quine.toString());
}

(function quine() {
  alert(`(${quine.toString()})()`);
})();

// ---- from other sources ----

{ // !! evaluates to itself, not logs itself
  // https://ethmcc.github.io/a-javascript-quine/
  $=_=>`$=${$};$()`;$()
  ($=()=>`($=${$})()`)();
  (func=()=>`(func=${func})()`)()
  func=_=>`func=${X};func();`;func();
  func=_=>`func=${func};func();`;func();
}

{
  // https://josephpetitti.com/blog/quines-in-javascript
  s=console.log;r=x=>x.replace(/\\/g,"\\\\").replace(/"/g,"\\\"");u="s(\"s=console.log;r=\"+r+\";u=\\\"\"+r(u)+\"\\\";\"+u);";s("s=console.log;r="+r+";u=\""+r(u)+"\";"+u);
  r=x=>x.replace(/(["\\])/g,"\\$1");u="console.log(\"r=\"+r+\";u=\\\"\"+r(u)+\"\\\";\"+u)";console.log("r="+r+";u=\""+r(u)+"\";"+u)
  r=x=>console.log(`r=${r};r()`);r()
}

{
  // https://gist.github.com/cowboy/6966747ad374fb97b0ab
  //  enter, non-weak quines

  (function $($_$,_,_$,_$_,$_){return[_=_[$_$](_$[$_++])][_[$_++]][_[$_++]]([][_[$_--]][_[$_++]](_$_,function($$){return _$[$$]||[$_,_$_,_,$_$,$][$_--]},$_++),_[++$_])})('split',',join,call,map',',()\'\\','1821383038303012434430383082',0)

  s = "; console.log('s =', JSON.stringify(s), s)" ; console.log('s =', JSON.stringify(s), s)

  function q(){return q+";q()"};q()

  q="'";s='q="";s=;f=s.substr.bind(s);console.log(f(0,3)+q+f(3,4)+q+s+q+f(7));';f=s.substr.bind(s);console.log(f(0,3)+q+f(3,4)+q+s+q+f(7));

  (()=>{var arr=["(()=>{var arr=",0,";arr[1]=JSON.stringify(arr);return arr.join(\"\");})()"];arr[1]=JSON.stringify(arr);return arr.join("");})()

  a='r=(s,p,q)=>s.replaceAll(p,q);b="\'"+r(r(a,"\\\\","\\\\\\\\"),"\\\'","\\\\\'")+"\'";console.log("a="+b+";"+a);';r=(s,p,q)=>s.replaceAll(p,q);b="'"+r(r(a,"\\","\\\\"),"\'","\\'")+"'";console.log("a="+b+";"+a);

  // Uncaught SyntaxError: Unexpected identifier

  const charCode = 34;
  const code = [
      "const charCode = 34;",
      "const code = [",
      "",
      "];",
      "for (let i = 0; i < 2; i++) console.log(code[i])",
      "for (let i = 0; i < code.length; i++) console.log(code[2] + '    ' + String.fromCharCode(charCode) + code[i] + String.fromCharCode(charCode) + ',');",
      "for (let i = 3; i < code.length; i++) console.log(code[i])"
  ];

  for (let i = 0; i < 2; i++) console.log(code[i]);
  for (let i = 0; i < code.length; i++) console.log(code[2] + '    ' + String.fromCharCode(charCode) + code[i] + String.fromCharCode(charCode) + ',');
  for (let i = 3; i < code.length; i++) console.log(code[i])

  ({0(){alert(`({${this[0]}})[0]()`)}})[0]()

  // Never ending eval...
  let x ="let x =%22quinner%22;let y=decodeURI(x).replace(/quinner/, x);alert(y);eval(y);";let y=decodeURI(x).replace(/quinner/, x);alert(y);eval(y);
}

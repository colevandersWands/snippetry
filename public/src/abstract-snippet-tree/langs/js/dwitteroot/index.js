import { CodeJar } from '../../../../../lib/codejar.min.js';

import { uncompress } from './uncompress.js';
import { compress } from './compress.js';

function dweeterize(s, CodeJar, Prism, compress, uncompress) {
  const dwitterContainer = document.createElement('div');
  dwitterContainer.id = s.title + '-dweeting';
  dwitterContainer.style =
    'display: flex; flex-direction: column; align-items: center; justify-content: center;';
  dwitterContainer.innerHTML = `
    <canvas id="${s.title}-canvas" width="1920" height="1080" style="width: 75%"> </canvas>

    <div style="padding-top: 2em;">
      <code style="color: grey">function u(t) {</code>
      <pre id="${s.title}-editor" class="editor lang-js"><code>${s.text}</code></pre>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div style="display: inline-block;">
          <code style="color: grey">} // </code>
          <code id="count"  style="color: grey"></code>
        </div>
        <span style="display: inline-block;">
          <input id="${s.title}-compress" type="checkbox"/>
          <label for="${s.title}-compress" style="margin-left: -0.5em">compress</label>
        </span>
      </div>
      <pre id="${s.title}-out" style="color: red"></pre>
    </div>`;

  const initializeDweet = (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.unobserve(dwitterContainer);

        let intervalId = 0;
        const animationObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) dweeting();
              else clearInterval(intervalId);
            }
          },
          {
            root: null, // Use the viewport as the root
            threshold: 1, // Trigger callback when any part of the target enters the viewport
          },
        );

        animationObserver.observe(dwitterContainer.children[0]);

        const editor = dwitterContainer.children[1].children[1];
        const out = dwitterContainer.children[1].children[3];
        const count = dwitterContainer.children[1].children[2].children[0].children[1];

        const dweeting = () => {
          Prism.highlightElement(editor);

          const dweet = editor.textContent; // side-effect
          s.text = dweet;

          const dweetLength = [...dweet].length;
          count.innerText = dweetLength + '/140';
          if (dweetLength > 140) count.style.color = 'red';
          else count.style.color = 'grey';

          let c = dwitterContainer.children[0];
          let x = c.getContext`2d`;
          let S = Math.sin;
          let C = Math.cos;
          let T = Math.tan;
          let R = (r = 0, g = 0, b = 0, a = 1) => `rgba(${r},${g},${b},${a})`;

          clearInterval(intervalId);

          let frame = 0;
          let u = () => {};
          try {
            u = eval(`(t) => {\n\n${dweet}\n\n}`);

            x.clearRect(0, 0, c.width, c.height);
            out.innerText = '';

            intervalId = setInterval(() => {
              try {
                u(frame++ / 60);
                out.innerText = '';
              } catch (err) {
                console.error(err);
                out.innerText = err;
              }
            }, 16.66666667);
          } catch (err) {
            u = () => {};
            console.error(err);
            out.innerText = err;
            clearInterval(intervalId);
            frame = 0;
          }
        };

        const jar = CodeJar(editor, dweeting);
        jar.updateCode(s.text);

        const copmryess =
          dwitterContainer.children[1].children[2].children[1].children[0];
        copmryess.addEventListener('input', (e) => {
          if (e.target.checked) {
            jar.updateCode(compress(editor.textContent));
          } else {
            jar.updateCode(uncompress(editor.textContent));
          }
          editor.setAttribute('contenteditable', !e.target.checked);
        });
      }
    }
  };

  new IntersectionObserver(initializeDweet, {
    root: null, // Use the viewport as the root
    threshold: 0, // Trigger callback when any part of the target enters the viewport
  }).observe(dwitterContainer);

  return dwitterContainer;
}

// some loophole allows this to eval unstrict code in a module
export const dwitteroot = (snippet) =>
  new Function(
    'snippet',
    'CodeJar',
    'Prism',
    'compress',
    'uncompress',
    `return (${dweeterize.toString()})(snippet, CodeJar, Prism, compress, uncompress)`,
  )(snippet, CodeJar, Prism, compress, uncompress);

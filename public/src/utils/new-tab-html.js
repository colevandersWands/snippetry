export const newTabHTML = (snippet) => {
  console.log(`\n========== ${snippet.name} ==========\n`);

  const evaller = document.createElement('iframe');
  evaller.style = 'border: none; height: 100vh; width: 100vw;';
  evaller.src = './snippets/html.sandbox.txt';
  evaller.onload = () => {
    evaller.contentDocument.body.innerHTML = '';
    evaller.contentDocument.body.style = evaller.style =
      'border: none; height: 100vh; width: 100vw;';

    const container = document.createElement('div');
    container.innerHTML = snippet.code;
    Array.from(container.children).forEach((el) => {
      if (el.nodeName === 'SCRIPT') {
        const script = document.createElement('script');
        Array.from(el.attributes).forEach((attribute) => {
          script.setAttribute(attribute.name, attribute.value);
        });
        script.appendChild(document.createTextNode(el.innerHTML));
        evaller.contentDocument.body.appendChild(script);
      } else {
        evaller.contentDocument.body.appendChild(el);
      }
    });

    evaller.contentDocument.dispatchEvent(new Event('resize'));
  };

  const x = window.open();
  x.document.open();
  x.document.appendChild(evaller);
  x.document.close();
};

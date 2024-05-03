const assert = (assertion, ...messages) => {
  if (assertion) {
    console.groupCollapsed('%c√ YES ', 'font-weight: bold; color: green;', ...messages);
  } else {
    console.groupCollapsed('%c✖ NO ', 'font-weight: bold; color: red;', ...messages);
  }
  console.trace();
  console.groupEnd();
};

const evaller = document.createElement('iframe');
evaller.style.display = 'none';

let firstRun = true;

export const runCode = (snippet = {}, debug = false) => {
  if (firstRun) {
    alert(
      "open your dev console to see the program's logs \n(if you're using a desktop)",
    );
    firstRun = false;
  }

  if (document.body.contains(evaller)) document.body.removeChild(evaller);

  console.log(`\n========== ${snippet.title} ==========\n`);

  // evaller.src = `./snippets/${snippet.title}`;
  evaller.src = `./snippets/html.sandbox.txt`;

  const finalCode = debug
    ? '/* ------------------------ */ debugger;\n\n\n\n\n' +
      snippet.text +
      '\n\n\n\n\n/* ------------------------ */ debugger;'
    : snippet.text;

  evaller.onload = () => {
    evaller.contentWindow.console.assert = assert;

    const script = document.createElement('script');
    if (snippet.title.includes('.mjs')) {
      script.type = 'module';
    }
    script.innerHTML = finalCode;

    evaller.contentDocument.body.appendChild(script);
  };

  document.body.appendChild(evaller);
};

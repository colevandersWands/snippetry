export const nToDom = (vNode = {}) => {
  const { nodeName = 'div', attributes = {}, children = [], listeners = [] } = vNode;
  if (vNode instanceof Element) return vNode;

  const domNode = document.createElement(nodeName);

  for (const key in attributes) {
    try {
      domNode[key] = attributes[key];
    } catch (_) {
      try {
        domNode.setAttribute(key, attributes[key]);
      } catch (_) {
        console.log('skipping attribute:', key);
      }
    }
  }

  for (const child of children) {
    if (child.__proto__ === Object.prototype) {
      domNode.appendChild(nToDom(child));
    } else if (child instanceof String) {
      domNode.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      domNode.appendChild(child);
    }
  }

  for (const listener of listeners) {
    domNode.addEventListener(listener.e || 'click', listener.cb);
  }

  return domNode;
};

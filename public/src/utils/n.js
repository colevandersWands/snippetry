export const n = (nodeName = 'div', _attributes, _children, _listeners) => {
  const attributes =
    _attributes?.__proto__ === Object.prototype
      ? _attributes
      : typeof _attributes === 'string'
      ? { className: _attributes }
      : {};

  const children = Array.isArray(_children)
    ? _children
    : _children?.__proto__ === Object.prototype ||
      typeof _children == 'string' ||
      _children instanceof HTMLElement
    ? [_children]
    : [];

  const listeners = Array.isArray(_listeners)
    ? _listeners
    : _listeners?.__proto__ === Object.prototype
    ? [_listeners]
    : typeof _listeners === 'function'
    ? [{ e: 'click', cb: _listeners }]
    : [];

  const vNode = {
    nodeName: nodeName.toUpperCase(),
    attributes,
    listeners,
  };

  vNode.children = children
    .filter((child) => child)
    .map((child) => (typeof child === 'string' ? new String(child) : child))
    .map((child) => ((child.parent = vNode), child));

  return vNode;
};

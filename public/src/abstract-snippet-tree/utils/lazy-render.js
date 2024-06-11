export const lazyRender = (lazyChild = () => {}) => {
  const lazyContainer = document.createElement('div');

  const lazyRender = (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.unobserve(lazyContainer);

        lazyContainer.appendChild(lazyChild());
      }
    }
  };

  new IntersectionObserver(lazyRender, {
    root: null, // Use the viewport as the root
    threshold: 0, // Trigger callback when any part of the target enters the viewport
  }).observe(lazyContainer);

  return lazyContainer;
};

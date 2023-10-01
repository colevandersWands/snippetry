// https://www.phind.com/agent?cache=cln08inxx0005l508e8vrlqbj

export class DuplicateComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .duplicate {
          cursor: pointer;
          padding: 10px;
          background-color: lightblue;
          margin-bottom: 10px;
        }
      </style>
      <div class="duplicate">Click me to duplicate</div>
    `;
    this.shadowRoot
      .querySelector('.duplicate')
      .addEventListener('click', this.duplicate.bind(this));
  }

  duplicate() {
    const duplicateElement = document.createElement('duplicate-component');
    this.parentNode.insertBefore(duplicateElement, this.nextSibling);
  }
}



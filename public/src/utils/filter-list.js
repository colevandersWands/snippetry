import { SEPARATOR } from "../CONSTANTS.js";

export const filterList = (entries, key) => {
  const entryContainer = document.createElement('ul');
  for (const entry of entries) {
    const id = key + SEPARATOR + entry.value;
    const entryLi = document.createElement('span');
    entryLi.innerHTML = `<input id="${id}" type="checkbox" ${
      entry.selected ? 'checked' : ''
    }/><label for="${id}">${entry.value}  </label>`;
    entryContainer.appendChild(entryLi);
  }
  return entryContainer;
};
import { state } from '../state.js';

import { selectTag } from '../custom-events/select-tag.js';

import { filterSnipPets } from '../procedures/filter-snip-pets.js';

const tagsRoot = document.getElementById('tags');

const tagsContainer = document.createElement('ul');
for (const tag of state.tags) {
  const tagLi = document.createElement('span');
  tagLi.innerHTML = `<span style="display: inline-block; padding-bottom: 0.5em;">
    <input id="tag-${tag.value}" type="checkbox" ${
    tag.selected ? 'checked' : ''
  } style="margin-left: 1em"/>
    <label for="tag-${tag.value}" style="margin-left: -0.5em">${tag.value}</label>
  </span>`;
  tagLi.addEventListener('change', (e) => {
    tagLi.dispatchEvent(selectTag(tag));
    e.preventDefault();
  });
  tagsContainer.appendChild(tagLi);
}
tagsRoot.appendChild(tagsContainer);

tagsRoot.addEventListener('select-tag', (e) => {
  e.detail.selected = document.getElementById(`tag-${e.detail.value}`).checked;
  filterSnipPets();
});

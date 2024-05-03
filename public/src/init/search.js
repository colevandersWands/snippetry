import { filterSnipPets } from '../filter-snip-pets/index.js';
import { state } from '../state.js';

const searchField = document.getElementById('search-field');

searchField.value = state.search;

searchField.addEventListener('input', (e) => {
  state.search = e.target.value;
  filterSnipPets();
});

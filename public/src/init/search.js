import { filterSnipPets } from '../procedures/filter-snip-pets.js';
import { state } from '../state.js';

const searchField = document.getElementById('search-field');

searchField.value = state.search;

searchField.addEventListener('input', (e) => {
  state.search = e.target.value;
  filterSnipPets();
});

import { chronicle } from './chronicle.mjs';
import { sequitur } from './sequitur.mjs';

const non = chronicle(
  eval(
    sequitur
      .toString()
      .replaceAll('sequitur', 'NON')
      .replaceAll('non', 'SEQUITUR')
      .toLowerCase(),
  ),
);

non('hi').hi('bye').bye().sequitur;

console.log(non._chronicle);

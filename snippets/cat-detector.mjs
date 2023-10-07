import { theArrivalOf } from './introducing.mjs';

let voice = 'Tessa';
let volume = 0.4;

const _The_Inspector_ = await theArrivalOf('The Inspector', { voice, volume });

await _The_Inspector_(
  'In a moment you will be prompted to enter some text, please type "cat".',
);

let isNotACat = true;
while (isNotACat) {
  const maybeACat = prompt() || '';

  if (maybeACat?.toLowerCase() === 'cat') {
    await _The_Inspector_('Thank you for following directions, you may leave now.');
    isNotACat = false;
  } else {
    volume += 0.1;
    if (voice === 'Tessa' && volume > 1) voice = 'Anna';

    await _The_Inspector_(`"${maybeACat}" is most certainly not a cat.  Try again.`, {
      volume,
      voice,
    });
  }
}

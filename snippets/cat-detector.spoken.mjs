import { theArrivalOf } from './introducing.mjs';

const voice = 'Tessa';
let volume = 0.4;

const _The_Inspector_ = await theArrivalOf('The Inspector', { voice, volume });

await _The_Inspector_(
  'In a moment you will be prompted to enter some text, please type "cat".',
);

while (true) {
  const maybeACat = prompt();

  if (maybeACat?.toLowerCase() === 'cat') {
    await _The_Inspector_('Thank you for following directions, you may leave now.', {
      volume: 0.4,
    });
    break;
  }

  if (maybeACat === null) {
    await _The_Inspector_('there is no escape');
  } else if (maybeACat?.toLowerCase() !== 'cat') {
    await _The_Inspector_(`"${maybeACat}" is most certainly not a cat.  Try again.`, {
      volume,
    });
  }
  volume += 0.1;

  if (volume > 1) {
    _The_Inspector_("I'm done with this.", { volume: 0.4 });
    break;
  }
}

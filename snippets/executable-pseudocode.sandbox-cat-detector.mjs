import _ from './executable-pseudocode.mjs';

const { introducing, prompt, setTimeout } = _;

const Cat_Detector = async () => {
  let volume = 0.5;
  const _The_Inspector_ = introducing('The Inspector', {
    voice: 'Tessa',
    volume: 0.5,
  });

  await _The_Inspector_(
    'In a moment you will be prompted to enter some text, please type "cat".',
  );

  let isNotACat = true;
  while (isNotACat) {
    const maybeACat = prompt() || '';

    if (maybeACat?.toLowerCase() === 'cat') {
      await _The_Inspector_(
        'Thank you for following directions, you may leave now.',
      );
      isNotACat = false;
    } else {
      await _The_Inspector_(
        `"${maybeACat}" is most certainly not a cat.  Try again.`,
        { volume: (volume += 0.1), voice: volume >= 1 ? 'Anna' : 'Tessa' },
      );
    }
  }
};

setTimeout(Cat_Detector, 100);

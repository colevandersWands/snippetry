import projector from './projector.mjs';

// https://www.asciiart.eu/nature/clouds
const cloud = `
            .-~~~-.
    .- ~ ~-(       )_ _
   /                    ~ -.
  |                          ',
   \\                         .'
     ~- ._ ,. ,.,.,., ,.. -~`;
//  https://ascii.co.uk/art/lightning
const lightning = `${`
                  ,/
                ,'/
              ,' /
            ,'  /_____,
         .'____    ,'
             /  ,'
            / ,'
           /,'
          /'`}${Array(21).fill('\n').join('')}`;
const ground = `___.-------._____/¯¯¯¯¯¯\`----,____`;

const drop = () => (Math.random() < 0.2 ? ',' : ' ');
const row = () => [' ', ' ', ...Array(13).fill(' ').map(drop)];

function* rainstorm(rain = Array(31).fill('').map(row)) {
  while (rainstorm) {
    rain.pop(), rain.unshift(row());
    const flash = Math.random() < 0.1;
    yield [
      [`%c${cloud}`, `color: ${flash ? 'lightgrey' : 'grey'};`],
      flash
        ? [`%c${lightning}`, 'color: orange;']
        : [`%c${rain.flatMap((r) => r.join(' ')).join('\n')}`, 'color: blue;'],
      [`%c${ground}`, `color: ${flash ? 'lightgreen' : 'green'};`],
    ];
  }
}
projector(rainstorm, { frameRate: 7, maxFrames: 100 });

// tags: reel, sketch

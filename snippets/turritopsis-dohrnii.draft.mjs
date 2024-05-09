import { statelessMachine } from './stateless-machine.mjs';

/* it can 
	have a sex
	reproduce asexually as a polyp (budding off medusas)
	reproduce sexually as an adult by releasing eggs and sperm
	eat (extra hungry as medusa (mature))
	poop
	get older
	planula -> polyp
	polyp -> medusa (immature)
	medusa (immature) -> medusa (mature)
	medusa (*) -> polyp : when stressed, assaulted, sick or old
	be dead 
*/

const eat = (next = '') => ({ eat: { state: next, cb: () => console.log('poop') } });

const lifeStages = {
  planula: {
    mature: 'polyp',
  },
  polyp: {
    mature: 'medusje',
    reproduce: {
      se: () => console.log('bud medusas'),
      state: 'polyp',
    },
  },
  medusa: {
    stress: 'polyp',
    reproduce: {
      se: () => console.log('release egg/sperm pending sex'),
      state: 'medusa',
    },
  },
};

// tags: bunny

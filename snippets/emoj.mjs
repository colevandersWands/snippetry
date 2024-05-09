import { pipe } from './pipe.mjs';

const charmoji = {
  a:'🅰️',b:'🅱️',c:'©️',d:'🇩',e:'🇪',f:'🇫',g:'🇬',h:'🇭',i:'ℹ️',j:'🇯',k:'🇰',l:'🇱',m:'Ⓜ️',
  n:'🇳',o:'🅾️',p:'🅿️',q:'🇶',r:'®️',s:'💲',t:'🇹',u:'🇺',v:'✅',w:'🇼',x:'❌',y:'🇾',z:'💤',
  0:'0️⃣',1:'1️⃣',2:'2️⃣',3:'3️⃣',4:'4️⃣',5:'5️⃣',6:'6️⃣',7:'7️⃣',8:'8️⃣',9:'9️⃣','!':'⚠️','?':'❓',
  '-':'➖','+':'➕','=':'🟰','/':'➗','*':'🔅','<':'◀️','>':'▶️','‽':'⁉️'
};

const emojify = (arg) =>
  typeof arg === 'string'
    ? arg.split('').map((char) => charmoji[char] || char).join('')
    : arg;

const emojisole = pipe(
  Object.entries,
  (entries) => entries.map(([key, fn]) => [key, (...args) => fn(...args.map(emojify))]),
  Object.fromEntries,
)(console);

export const emoj = emojisole.log;

Object.assign(emoj, emojisole);

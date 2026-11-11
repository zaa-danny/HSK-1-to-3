/* Turns the raw rows into card objects, builds the 4 decks (1, 2, 3, all) and gives every card a unique id */
const toCard = r => ({id:r[0], h:r[0], p:r[1], en:r[2], cat:r[3], ex:r[4], exp:r[5], exen:r[6], ls:r[7]||[], src:r[8]||''});
const CARDS = {1: RAW1.map(toCard), 2: RAW2.map(toCard), 3: RAW3.map(toCard)};
{ // give polysemous characters (长, 还, 花, 只, 过) separate progress ids
  const seen = new Set();
  [1,2,3].forEach(l => CARDS[l].forEach(c => { if(seen.has(c.id)) c.id = c.h + '|' + c.p; if(seen.has(c.id)) c.id = c.h + '|' + c.p + '|' + c.en.slice(0,10); seen.add(c.id); }));
}
[1,2,3].forEach(l => CARDS[l].forEach(c => c.lv = l));
CARDS.all = [...CARDS[1], ...CARDS[2], ...CARDS[3]];
const DECKS = CARDS;

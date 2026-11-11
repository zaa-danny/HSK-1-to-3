/* ---------- STATE ---------- */
const INTERVALS = [0, 10, 1440, 2880, 5760, 10080]; // minutes until next review, by box
let level = '1';
let srs = {};
const $ = id => document.getElementById(id);
const deck = () => DECKS[level];
const key = () => 'hsk_all_srs_v2';
function load(){
  try{ srs = JSON.parse(localStorage.getItem(key())||'{}'); }catch(e){ srs = {}; }
  try{ const old = JSON.parse(localStorage.getItem('hsk1_srs_v1')||'{}'); for(const k in old) if(!srs[k]) srs[k]=old[k]; }catch(e){}
  try{ level = localStorage.getItem('hsk_level_v1') || '1'; }catch(e){}
  if(!CARDS[level]) level = '1';
  $('level').value = level;
}
function save(){ try{ localStorage.setItem(key(), JSON.stringify(srs)); }catch(e){} }
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const speakText = h => h.replace(/\s*\(.*\)/,'');
const inCat = (c, cat) => cat==='all' || c.cat===cat;

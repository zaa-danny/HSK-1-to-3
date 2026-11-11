/* ---------- CHARACTERS ---------- */
const stripPar = h => h.replace(/\s*[(（].*?[)）]/g,'');
const hzOf = h => [...stripPar(h)].filter(ch => ch>='一' && ch<='鿿');
const CHARS = (function(){
  const map = {};
  const get = ch => map[ch] || (map[ch] = {ch, words:[], own:[]});
  CARDS.all.forEach(c => { const cs = hzOf(c.h); if(cs.length===1) get(cs[0]).own.push(c); });
  CARDS.all.forEach(c => { const cs = hzOf(c.h); if(cs.length>=2) new Set(cs).forEach(ch => get(ch).words.push(c)); });
  return Object.values(map).filter(x => x.words.length>=2).map(x => {
    x.own.sort((a,b)=>a.lv-b.lv);
    x.minLv = Math.min(...x.words.concat(x.own).map(c=>c.lv));
    const g = CH_GLOSS[x.ch];
    x.meaning = x.own.length ? x.own.map(c => (x.own.length>1 ? c.p+' — ' : '')+c.en) : (g ? [g[1]] : []);
    x.pinyin = x.own.length ? [...new Set(x.own.map(c=>c.p))].join(' / ') : (g ? g[0] : '');
    x.search = (x.ch+' '+x.pinyin+' '+x.meaning.join(' ')).toLowerCase();
    return x;
  });
})();
const CH_BY = Object.fromEntries(CHARS.map(x=>[x.ch,x]));
let chLearned = new Set(), chSel = null;
try{ chLearned = new Set(JSON.parse(localStorage.getItem('hsk_chars_v1')||'[]')); }catch(e){}
function chSave(){ try{ localStorage.setItem('hsk_chars_v1', JSON.stringify([...chLearned])); }catch(e){} }
function chList(){
  const q = $('chSearch').value.trim().toLowerCase(), lv = +$('chLevel').value, hide = $('chHide').checked, sort = $('chSort').value;
  let l = CHARS.filter(x => (!q || x.search.indexOf(q)>=0) && (!lv || x.minLv===lv) && !(hide && chLearned.has(x.ch)));
  l.sort((a,b) => sort==='level' ? (a.minLv-b.minLv || b.words.length-a.words.length) : (b.words.length-a.words.length || a.minLv-b.minLv));
  return l;
}
function renderChars(){
  const l = chList();
  $('chStat').textContent = `${CHARS.length} reused characters · learned ${CHARS.filter(x=>chLearned.has(x.ch)).length} · showing ${l.length}`;
  $('chGrid').innerHTML = l.map(x => `<button class="chtile ${chLearned.has(x.ch)?'done':''} ${x.ch===chSel?'sel':''}" data-ch="${x.ch}"><b>${x.ch}</b><i>${x.words.length} words</i></button>`).join('') || '<div class="small">No characters match.</div>';
  renderCharDetail(l);
}
function renderCharDetail(l){
  const d = $('chDetail');
  const x = chSel && CH_BY[chSel];
  if(!x){ d.innerHTML = '<div class="msg"><div class="small">Tap a character below to see its meaning and every word that uses it.</div></div>'; return; }
  const i = l.findIndex(y=>y.ch===x.ch);
  const words = x.words.slice().sort((a,b)=>a.lv-b.lv || a.h.length-b.h.length);
  const wordHtml = w => stripPar(w.h).split('').map(ch => ch===x.ch ? `<mark>${ch}</mark>` : (CH_BY[ch] ? `<span class="jump" data-ch="${ch}">${ch}</span>` : ch)).join('');
  d.innerHTML = `<div class="chcard">
    <div class="chbig">${x.ch}</div>
    <div class="row" style="justify-content:center"><button class="audio" data-s="${x.ch}">🔊</button>${x.pinyin?`<span class="pinyin">${x.pinyin}</span>`:''}</div>
    ${x.meaning.map(m=>`<div class="en" style="font-size:1rem">${m}</div>`).join('')}
    <div class="small">${x.own.length?'Also a word on its own (HSK '+x.own.map(c=>c.lv).join('/')+')':'Used inside words (not a stand-alone word in HSK 1–3)'} · first seen in HSK ${x.minLv}</div>
    <div class="row" style="justify-content:center">
      <button id="chPrev" ${i<=0?'disabled':''}>← Prev</button>
      <button id="chDone" class="btn ${chLearned.has(x.ch)?'good':''}" style="padding:8px 14px;${chLearned.has(x.ch)?'':'background:var(--chip);color:var(--text)'}">${chLearned.has(x.ch)?'✓ Learned':'Mark as learned'}</button>
      <button id="chNext" ${i<0||i>=l.length-1?'disabled':''}>Next →</button>
    </div>
    <div class="words"><div class="small" style="margin:6px 0">Words using ${x.ch} (${words.length})</div>
      <table>${words.map(w=>`<tr><td class="h">${wordHtml(w)}</td><td class="p">${w.p}</td><td>${w.en} <span class="lvchip">HSK ${w.lv}</span></td><td><button class="audio" data-s="${speakText(w.h)}">🔊</button></td></tr>`).join('')}</table>
    </div></div>`;
  $('chPrev').onclick = () => { if(i>0){ chSel = l[i-1].ch; renderChars(); } };
  $('chNext').onclick = () => { if(i>=0 && i<l.length-1){ chSel = l[i+1].ch; renderChars(); } };
  $('chDone').onclick = () => { chLearned.has(x.ch) ? chLearned.delete(x.ch) : chLearned.add(x.ch); chSave(); renderChars(); };
}
function chPick(ch){ chSel = ch; renderChars(); const el = $('chDetail'); if(el.scrollIntoView) el.scrollIntoView({block:'nearest'}); }
$('chGrid').onclick = e => { const b = e.target.closest('.chtile'); if(b) chPick(b.dataset.ch); };
$('chDetail').onclick = e => {
  const a = e.target.closest('button[data-s]'); if(a){ speak(a.dataset.s); return; }
  const j = e.target.closest('.jump'); if(j) chPick(j.dataset.ch);
};
['chSearch','chLevel','chSort','chHide'].forEach(id => { $(id).oninput = renderChars; $(id).onchange = renderChars; });

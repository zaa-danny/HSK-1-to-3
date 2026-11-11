/* ---------- STUDY ---------- */
let queue = [], cur = null, flipped = false;
function box(c){ return srs[c.id] ? srs[c.id].box : -1; }
function buildQueue(ahead){
  const now = Date.now(), cat = $('catStudy').value;
  const pool = lessonBase($('lessonStudy').value).filter(c => inCat(c,cat) && inLesson(c,$('lessonStudy').value) && (ahead || !srs[c.id] || srs[c.id].due <= now));
  const reviews = shuffle(pool.filter(c=>srs[c.id])).sort((a,b)=>box(a)-box(b));
  const fresh = shuffle(pool.filter(c=>!srs[c.id]));
  queue = reviews.concat(fresh);
  nextCard();
}
function nextCard(){
  cur = queue[0] || null; flipped = false; renderStudy(); renderStats();
}
function renderStats(){
  const d = deck(); let n=0,l=0,m=0;
  d.forEach(c=>{ const b=box(c); if(b<0)n++; else if(b>=4)m++; else l++; });
  $('statText').textContent = `${d.length} words · New ${n} · Learning ${l} · Mastered ${m} · Left in this session ${queue.length}`;
  $('barM').style.width = (m/d.length*100)+'%';
  $('barL').style.width = (l/d.length*100)+'%';
}
function renderStudy(){
  const a = $('studyArea');
  if(!cur){
    a.innerHTML = `<div class="msg"><div style="font-size:1.2rem;font-weight:700">🎉 You're all caught up</div><div class="small">No cards are due right now in this category.</div><button id="aheadBtn" class="btn good">Study ahead anyway</button></div>`;
    $('aheadBtn').onclick = () => buildQueue(true);
    return;
  }
  const showPy = $('showPy').checked;
  a.innerHTML = `
    <div class="card" id="card">
      <span class="badge">${cur.cat}${tagLabel(cur)?' · '+tagLabel(cur):''}${cur.src?' · '+SRC_LABEL[cur.src]:''}</span>
      <div class="hanzi">${cur.h}</div>
      <button class="audio" id="aud1">🔊 Listen</button>
      <div class="hint" id="hint">Tap the card (or press Space) to reveal</div>
      <div class="back ${flipped?'on':''}" id="back">
        <div class="pinyin">${cur.p}</div>
        <div class="en">${cur.en}</div>
        <div class="ex">
          <div class="zh">${cur.ex} <button class="audio" id="aud2">🔊</button></div>
          ${showPy?`<div class="py">${cur.exp}</div>`:''}
          <div class="tr">${cur.exen}</div>
        </div>
      </div>
    </div>
    <div class="answer">
      <button class="btn again" id="againBtn">❌ Again (1)</button>
      <button class="btn good" id="goodBtn">✅ Got it (2)</button>
    </div>`;
  $('hint').style.display = flipped ? 'none' : 'block';
  $('card').onclick = flip;
  $('aud1').onclick = e => { e.stopPropagation(); speak(speakText(cur.h)); };
  $('aud2').onclick = e => { e.stopPropagation(); speak(cur.ex); };
  $('againBtn').onclick = () => answer(false);
  $('goodBtn').onclick = () => answer(true);
}
function flip(){
  if(!cur) return;
  flipped = !flipped;
  $('back').classList.toggle('on', flipped);
  $('hint').style.display = flipped ? 'none' : 'block';
}
function answer(good){
  if(!cur) return;
  const c = queue.shift();
  const s = srs[c.id] || {box:0, due:0};
  if(good){ s.box = Math.min(5, s.box+1); s.due = Date.now() + INTERVALS[s.box]*60000; }
  else { s.box = 0; s.due = 0; queue.splice(Math.min(4, queue.length), 0, c); }
  srs[c.id] = s; save(); nextCard();
}

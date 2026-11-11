/* ---------- QUIZ ---------- */
let quiz = null;
function startQuiz(onlyCards){
  const cat = $('catQuiz').value, type = $('quizType').value;
  let n = parseInt($('quizLen').value,10);
  let pool = onlyCards || lessonBase($('lessonQuiz').value).filter(c=>inCat(c,cat) && inLesson(c,$('lessonQuiz').value));
  if(pool.length < 4){ $('quizArea').innerHTML = '<div class="msg"><div>Not enough words in this selection for a quiz. Choose a wider category or lesson range.</div></div>'; return; }
  pool = shuffle(pool); if(n>0 && !onlyCards) pool = pool.slice(0,n);
  const types = ['h2e','e2h','listen','h2p','p2h'];
  quiz = { i:0, score:0, wrong:[], qs: pool.map(c=>({card:c, type: type==='mixed' ? types[Math.floor(Math.random()*types.length)] : type})) };
  renderQuiz();
}
const toneless = p => p.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-zü]/g,'');
function options(card, type){
  const pool = deck().filter(c => c.id!==card.id);
  const field = (type==='e2h' || type==='p2h') ? 'h' : (type==='h2p' ? 'p' : 'en');
  const used = new Set([card[field]]);
  let cands = shuffle(pool.filter(c=>c.cat===card.cat)).concat(shuffle(pool.filter(c=>c.cat!==card.cat)));
  // Pinyin → Hanzi: never offer a word that sounds identical (e.g. 他 / 她), it would be ambiguous
  if(type==='p2h') cands = cands.filter(c => c.p!==card.p);
  // Hanzi → Pinyin: put one tone/near-sound look-alike first, like the real exam distractors
  if(type==='h2p'){
    const tl = toneless(card.p);
    const near = shuffle(pool.filter(c => toneless(c.p)===tl && c.p!==card.p));
    cands = near.slice(0,1).concat(cands);
  }
  const picks = [];
  for(const c of cands){ if(picks.length>=3) break; if(!used.has(c[field])){ used.add(c[field]); picks.push(c); } }
  return shuffle(picks.concat(card));
}
function renderQuiz(){
  const a = $('quizArea');
  if(quiz.i >= quiz.qs.length){
    const total = quiz.qs.length, pct = Math.round(quiz.score/total*100);
    a.innerHTML = `<div class="msg">
      <div style="font-size:1.3rem;font-weight:700">Score: ${quiz.score} / ${total} (${pct}%)</div>
      ${quiz.wrong.length ? `<div class="small">Words to review:</div><div class="chips">${quiz.wrong.map(c=>`<span class="chip">${c.h} · ${c.p} · ${c.en}</span>`).join('')}</div>
        <button class="btn again" id="reviewBtn">Quiz me on my mistakes</button>` : `<div>Perfect run! 🎉</div>`}
      <button class="btn good" id="againQ">New quiz</button></div>`;
    if(quiz.wrong.length) $('reviewBtn').onclick = () => startQuiz(quiz.wrong.slice());
    $('againQ').onclick = () => startQuiz();
    return;
  }
  const q = quiz.qs[quiz.i], c = q.card, opts = options(c, q.type);
  q.opts = opts;
  let prompt;
  if(q.type==='h2e') prompt = `<div class="big">${c.h}</div><div class="small">What does it mean?</div>`;
  else if(q.type==='e2h') prompt = `<div class="mid">${c.en}</div><div class="small">Which Chinese word is this?</div>`;
  else if(q.type==='h2p') prompt = `<div class="big">${c.h}</div><div class="small">Choose the correct pinyin</div>`;
  else if(q.type==='p2h') prompt = `<div class="big" style="color:var(--primary)">${c.p}</div><div class="small">Choose the correct Chinese word</div>`;
  else prompt = `<button class="audio" id="qPlay" style="font-size:1.4rem;padding:12px 20px">🔊 Play</button><div class="small" style="margin-top:8px">What did you hear?</div>`;
  a.innerHTML = `
    <div class="small">Question ${quiz.i+1} of ${quiz.qs.length} · Score ${quiz.score}</div>
    <div class="qbox">${prompt}</div>
    <div class="opts" id="opts">${opts.map((o,k)=>`<button class="opt" data-k="${k}">${(q.type==='e2h'||q.type==='p2h') ? `<b style="font-size:1.4rem">${o.h}</b>` : (q.type==='h2p' ? o.p : o.en)}</button>`).join('')}</div>
    <div id="feedback"></div>`;
  if(q.type==='listen'){ $('qPlay').onclick = () => speak(speakText(c.h)); setTimeout(()=>speak(speakText(c.h)), 250); }
  $('opts').onclick = e => {
    const b = e.target.closest('.opt'); if(!b || q.done) return;
    q.done = true;
    const chosen = opts[+b.dataset.k], ok = chosen.id===c.id;
    [...$('opts').children].forEach((el,k)=>{ if(opts[k].id===c.id) el.classList.add('right'); });
    if(ok){ quiz.score++; } else { b.classList.add('wrong'); quiz.wrong.push(c); srs[c.id] = {box:0, due:0}; save(); renderStats(); }
    const pickedK = +b.dataset.k;
    const rowsHtml = opts.map((o,k) => {
      const isC = o.id===c.id, isP = k===pickedK;
      return `<tr class="${isC?'okrow':(isP?'badrow':'')}"><td class="mk">${isC?'✓':(isP?'✗':'')}</td><td class="h">${o.h}</td><td class="p">${o.p}</td><td>${o.en}</td><td><button class="audio" data-s="${speakText(o.h)}">🔊</button></td></tr>`;
    }).join('');
    $('feedback').innerHTML = `<div class="msg" style="padding:14px;text-align:left">
      <div style="font-weight:700;color:var(${ok?'--good':'--bad'})">${ok?'✅ Correct!':'❌ Not quite — the answer is highlighted green'}</div>
      <table class="fbtable">${rowsHtml}</table>
      <div class="small">Example: ${c.ex} — ${c.exen}</div>
      <div class="row" style="justify-content:center"><button class="audio" id="fbAud">🔊 Hear the example</button><button class="btn good" id="nextQ" style="padding:10px 22px">${quiz.i+1>=quiz.qs.length?'Finish':'Next'}</button></div></div>`;
    $('feedback').onclick = ev => { const x = ev.target.closest('button[data-s]'); if(x) speak(x.dataset.s); };
    $('fbAud').onclick = () => speak(c.ex);
    $('nextQ').onclick = () => { quiz.i++; renderQuiz(); };
  };
}

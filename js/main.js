/* ---------- WIRING ---------- */
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on', x===b));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on', p.id==='tab-'+b.dataset.tab));
  if(b.dataset.tab==='list') renderList();
  if(b.dataset.tab==='study') renderStats();
  if(b.dataset.tab==='chars') renderChars();
});
$('level').onchange = () => {
  level = $('level').value;
  try{ localStorage.setItem('hsk_level_v1', level); }catch(e){}
  fillCats(); quiz = null;
  $('quizArea').innerHTML = '<div class="msg"><div>Pick a mix and press <b>Start</b>. Wrong answers go back into your study queue.</div></div>';
  buildQueue(false); renderList();
};
$('catStudy').onchange = () => buildQueue(false);
$('lessonStudy').onchange = () => buildQueue(false);
$('showPy').onchange = renderStudy;
$('quizStart').onclick = () => startQuiz();
$('resetBtn').onclick = () => { if(confirm('Reset progress for the words in this level?')){ deck().forEach(c => delete srs[c.id]); save(); buildQueue(false); } };
document.addEventListener('keydown', e => {
  if(!$('tab-study').classList.contains('on') || e.target.tagName==='SELECT' || e.target.tagName==='INPUT') return;
  if(e.code==='Space'){ e.preventDefault(); flip(); }
  else if(e.key==='1' || e.key==='ArrowLeft') answer(false);
  else if(e.key==='2' || e.key==='ArrowRight') answer(true);
});

(function(){
  const names = {'1':'HSK 1','2':'HSK 2 (new words)','3':'HSK 3 (new words)','all':'All levels'};
  [...$('level').options].forEach(o => { o.textContent = names[o.value] + ' · ' + CARDS[o.value].length + ' words'; });
})();
load(); fillCats(); buildQueue(false);

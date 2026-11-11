/* ---------- CATEGORIES ---------- */
function fillCats(){
  const cats = [...new Set(deck().map(c=>c.cat))];
  const html = '<option value="all">All categories</option>' + cats.map(c=>`<option>${c}</option>`).join('');
  $('catStudy').innerHTML = html; $('catQuiz').innerHTML = html;
  fillLessons();
}
/* ---------- TEXTBOOK CHAPTER / LESSON FILTER ----------
   Tags look like "1:5" (HSK 1 book, chapter 5), "2:3" (HSK 2 book, chapter 3), "3:12" (HSK 3 book, lesson 12). */
const lessonNums = b => [...new Set(CARDS.all.flatMap(c => c.ls.filter(x=>x.startsWith(b+':')).map(x=>+x.split(':')[1])))].sort((x,y)=>x-y);
function inLesson(c, v){
  if(!v || v==='all') return true;
  if(v==='tb') return !!c.src;
  if(v==='none') return c.lv===3 && !c.src && !c.ls.some(x=>x.startsWith('3:'));
  const [b,r] = v.split('|');
  const nums = c.ls.filter(x=>x.startsWith(b+':')).map(x=>+x.split(':')[1]);
  if(r.indexOf('-')>0){ const [x,y]=r.split('-').map(Number); return nums.some(n=>n>=x && n<=y); }
  return nums.indexOf(+r)>=0;
}
// a chapter/lesson choice spans all decks (a chapter may contain words from another level); otherwise use the current deck
const lessonBase = v => (v && v.indexOf('|')>0) ? CARDS.all : deck();
function tagLabel(c){
  const one = (level==='1'||level==='2'||level==='3');
  return c.ls.filter(x => !one || x.startsWith(level+':')).map(x => {
    const [b,n] = x.split(':');
    return one ? BOOKS[b].unit+' '+n : 'H'+b+(b==='3'?' L':' Ch')+n;
  }).join(', ');
}
function fillLessons(){
  const books = level==='all' ? ['1','2','3'] : [level];
  let h = `<option value="all">All lessons</option>`;
  books.forEach(b => {
    const nums = lessonNums(b); if(!nums.length) return;
    const unit = BOOKS[b].unit; let g = '';
    [[1,5],[6,10],[11,15],[16,20]].forEach(([x,y]) => { if(nums.some(n=>n>=x&&n<=y)) g += `<option value="${b}|${x}-${y}">${unit}s ${x}–${y}</option>`; });
    g += nums.map(n => `<option value="${b}|${n}">${unit} ${n}${BOOKS[b].titles[n] ? ' · '+BOOKS[b].titles[n] : ''}</option>`).join('');
    h += level==='all' ? `<optgroup label="${BOOKS[b].name} textbook">${g}</optgroup>` : g;
  });
  const d = deck();
  if(d.some(c=>c.src)) h += '<option value="tb">Words outside the official lists (textbook only)</option>';
  if(d.some(c=>c.lv===3 && !c.src && !c.ls.some(x=>x.startsWith('3:')))) h += '<option value="none">HSK 3 official list only (not in textbook)</option>';
  $('lessonStudy').innerHTML = h; $('lessonQuiz').innerHTML = h;
}
const SRC_LABEL = {tb:'Textbook only', x:'Beyond syllabus'};

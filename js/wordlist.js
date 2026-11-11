/* ---------- WORD LIST ---------- */
function renderList(){
  const q = $('search').value.trim().toLowerCase();
  const rows = deck().filter(c => !q || c.h.includes(q) || c.p.toLowerCase().includes(q) || c.en.toLowerCase().includes(q));
  $('listBody').innerHTML = rows.map(c=>{
    const b = box(c), cls = b<0 ? '' : (b>=4 ? 'm' : 'l');
    return `<tr><td><span class="dot ${cls}"></span></td><td class="h">${c.h}</td><td class="p">${c.p}</td><td>${c.en}${tagLabel(c)?` <span class="small">· ${tagLabel(c)}</span>`:''}</td><td><button class="audio" data-s="${speakText(c.h)}">🔊</button></td></tr>`;
  }).join('') || '<tr><td>No matches.</td></tr>';
}
$('listBody').onclick = e => { const b = e.target.closest('button[data-s]'); if(b) speak(b.dataset.s); };
$('search').oninput = renderList;

/* ---------- FONT ---------- */
(function(){
  let f = 'song'; try{ f = localStorage.getItem('hsk_font_v1') || 'song'; }catch(e){}
  if(!['song','hei','kai'].includes(f)) f = 'song';
  document.documentElement.setAttribute('data-font', f); $('fontSel').value = f;
  $('fontSel').onchange = () => { const v = $('fontSel').value; document.documentElement.setAttribute('data-font', v); try{ localStorage.setItem('hsk_font_v1', v); }catch(e){} };
})();

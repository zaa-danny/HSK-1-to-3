/* ---------- AUDIO ---------- */
let zhVoice = null;
function pickVoice(){
  if(!('speechSynthesis' in window)) { $('voiceNote').textContent = 'Audio is not supported in this browser.'; return; }
  const v = speechSynthesis.getVoices();
  zhVoice = v.find(x=>/zh[-_]CN/i.test(x.lang)) || v.find(x=>/^zh/i.test(x.lang)) || null;
  $('voiceNote').textContent = (v.length && !zhVoice) ? 'No Chinese voice found on this device. Install one in your system speech settings to hear audio.' : '';
}
function speak(t){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = 'zh-CN'; if(zhVoice) u.voice = zhVoice; u.rate = 0.85;
  speechSynthesis.speak(u);
}
if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

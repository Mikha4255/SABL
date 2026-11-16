'use strict';

const HYPE_BONUSES = {
  'sabl king': 7,
  'sabl queen': 7,
  'человек-мем года': 7,
  'прайм года': 6,
  'bomboclat года': 6,
  'прайм года': 6,
  'лучший завозёр': 6,
  'гений года': 5,
  'человек-сюрприз года': 5,
  'стиль года': 5,
  'харизма года': 5,
};
const HYPE_DEFAULT_BONUS = 3;   // бонус для награды, которой нет в списке
const HYPE_BONUS_CAP = 30;      // потолок суммы бонусов
const HYPE_MAX_DICE = 5;        // максимум кубиков (1 + награды)
const HYPE_THRESHOLD = 42;      // порог «на хайпе»
const HYPE_CURSED = 67;         // проклятое число
const HYPE_WINDOW_MS = 5400000; // 1.5 часа
const HYPE_ARC = 251.327;
/* ===================================================== */

const HYPE_URL = String.fromCharCode(104,116,116,112,115,58,47,47,118,111,116,101,45,49,53,51,53,45,115,97,98,108,45,100,101,102,97,117,108,116,45,114,116,100,98,46,101,117,114,111,112,101,45,119,101,115,116,49,46,102,105,114,101,98,97,115,101,100,97,116,97,98,97,115,101,46,97,112,112);
const HYPE_LS = 'sabl2027_auth_user';
const HYPE_COLORS = ['#ff4d00','#ff6f00','#d4af37','#2ecc71','#f2e6d4'];

let hypeActiveKey = null, hypeRecord = null, hypeBusy = false, hypeRaf = null;

function hypeXmur3(str){
  let h = 1779033703 ^ str.length;
  for(let i=0;i<str.length;i++){ h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h<<13)|(h>>>19); }
  return function(){ h = Math.imul(h ^ (h>>>16), 2246822507); h = Math.imul(h ^ (h>>>13), 3266489909); return (h ^= h>>>16) >>> 0; };
}
function hypeMulberry32(a){
  return function(){ a|=0; a = (a + 0x6D2B79F5)|0; let t = Math.imul(a ^ (a>>>15), 1|a); t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14))>>>0) / 4294967296; };
}
function hypeNorm(s){ return String(s||'').toLowerCase().replace(/\s+/g,' ').trim(); }
function hypeBonusFor(nom){ const k = hypeNorm(nom); return (k in HYPE_BONUSES) ? HYPE_BONUSES[k] : HYPE_DEFAULT_BONUS; }
function hypeEsc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function hypeToArray(x){ if(!x) return []; if(Array.isArray(x)) return x; return Object.keys(x).sort((a,b)=>Number(a)-Number(b)).map(k=>x[k]); }
function hypeFmt(ms){ const s=Math.max(0,Math.floor(ms/1000)), p=n=>String(n).padStart(2,'0'); return p(Math.floor(s/3600))+':'+p(Math.floor(s%3600/60))+':'+p(s%60); }

function hypeCompute(key, awards, now){
  const bucket = Math.floor(now / HYPE_WINDOW_MS);
  const rng = hypeMulberry32(hypeXmur3(key + '#' + bucket)());
  const dice = Math.min(1 + awards.length, HYPE_MAX_DICE);
  const rolls = []; let base = 0;
  for(let i=0;i<dice;i++){ const r = Math.floor(rng()*101); rolls.push(r); if(r>base) base=r; }
  let bonus = 0;
  awards.forEach(a => { bonus += hypeBonusFor(a.nom); });
  bonus = Math.min(bonus, HYPE_BONUS_CAP);
  const v = Math.max(0, Math.min(100, base + bonus));
  return { v, bucket, t: now };
}

async function hypeLoad(key){
  const enc = encodeURIComponent(key);
  const [aw, st] = await Promise.all([
    fetch(HYPE_URL+'/awards_2027/'+enc+'.json').then(r=>r.ok?r.json():null).catch(()=>null),
    fetch(HYPE_URL+'/hype_2027/'+enc+'.json').then(r=>r.ok?r.json():null).catch(()=>null)
  ]);
  const awards = hypeToArray(aw).map(a => typeof a==='string' ? {nom:a,year:''} : {nom:a.nom||'',year:a.year||''});
  const now = Date.now(), bucket = Math.floor(now / HYPE_WINDOW_MS);
  if(st && st.bucket === bucket && typeof st.v === 'number') return st;
  const rec = hypeCompute(key, awards, now);
  try{ await fetch(HYPE_URL+'/hype_2027/'+enc+'.json', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(rec)}); }
  catch(e){ console.error('hype save', e); }
  return rec;
}

function hypeTickMark(v, cls, label){
  const phi = Math.PI*v/100, c = Math.cos(phi), s = Math.sin(phi);
  return '<line x1="'+(100-70*c).toFixed(1)+'" y1="'+(100-70*s).toFixed(1)+'" x2="'+(100-90*c).toFixed(1)+'" y2="'+(100-90*s).toFixed(1)+'" class="'+cls+'"/>' +
         '<text x="'+(100-97*c).toFixed(1)+'" y="'+(100-97*s+3).toFixed(1)+'" class="'+cls+'-t">'+label+'</text>';
}

function hypeTemplate(rec, key){
  const fio = key.split('|')[0];
  const on = rec.v >= HYPE_THRESHOLD && rec.v !== HYPE_CURSED;
  return '<section class="hype-card '+(on?'on':'off')+'">' +
    '<div class="hype-title">🔥 Индекс хайпа · '+hypeEsc(fio)+'</div>' +
    '<svg viewBox="0 0 200 112" class="hype-gauge" aria-hidden="true"><defs><linearGradient id="hypeGrad" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#840000"/><stop offset=".35" stop-color="#ff4d00"/><stop offset=".65" stop-color="#ff6f00"/><stop offset=".85" stop-color="#d4af37"/><stop offset="1" stop-color="#2ecc71"/></linearGradient></defs>' +
    '<path d="M 20 100 A 80 80 0 0 1 180 100" class="hype-track"/>' +
    '<path d="M 20 100 A 80 80 0 0 1 180 100" class="hype-arc" stroke="url(#hypeGrad)" style="stroke-dashoffset:'+HYPE_ARC+'"/>' +
    hypeTickMark(42,'hype-tick42','42') + hypeTickMark(67,'hype-tick67','67') +
    '<g class="hype-needle" style="transform:rotate(-90deg)"><line x1="100" y1="100" x2="100" y2="30"/><circle cx="100" cy="100" r="6"/></g></svg>' +
    '<div class="hype-num">0</div>' +
    '<div class="hype-label '+(on?'on':'off')+'">'+(on?'Ты на хайпе братуха':'Сегодня без хайпа')+'</div>' +
    (rec.v===HYPE_CURSED ? '<div class="hype-curse">Выпало 67 — проклятое число, вне хайпа 🙃</div>' : '') +
    '<div class="hype-timer">⏳ до обновления: <b class="hype-countdown">…</b></div>' +
    '</section>';
}

function hypeLockedTemplate(){
  return '<section class="hype-locked">' +
    '<div class="hype-lock-icon">🔒</div>' +
    '<div class="hype-locked-title">Индекс хайпа скрыт</div>' +
    '<p>Войди или зарегистрируйся, чтобы узнать, на хайпе ли ты сегодня.</p>' +
    '<button type="button" id="hypeLoginBtn">Войти / Зарегистрироваться</button>' +
    '</section>';
}

function hypeSparks(sec){
  const card = sec.querySelector('.hype-card'); if(!card) return;
  for(let i=0;i<18;i++){
    const s = document.createElement('i'); s.className='hype-spark';
    const a = Math.random()*Math.PI*2, d = 60+Math.random()*90;
    s.style.setProperty('--dx',(Math.cos(a)*d).toFixed(0)+'px');
    s.style.setProperty('--dy',(Math.sin(a)*d).toFixed(0)+'px');
    s.style.setProperty('--clr',HYPE_COLORS[i%HYPE_COLORS.length]);
    s.style.left='50%'; s.style.top='40%';
    s.addEventListener('animationend',()=>s.remove());
    card.appendChild(s);
  }
}

function hypeRender(rec, key){
  const sec = document.getElementById('hypeHome');
  sec.hidden = false;
  sec.innerHTML = hypeTemplate(rec, key);
  const num = sec.querySelector('.hype-num'), arc = sec.querySelector('.hype-arc'), needle = sec.querySelector('.hype-needle');
  requestAnimationFrame(()=>{ arc.style.strokeDashoffset = String(HYPE_ARC*(1-rec.v/100)); needle.style.transform = 'rotate('+(-90+180*rec.v/100)+'deg)'; });
  if(hypeRaf) cancelAnimationFrame(hypeRaf);
  const t0 = performance.now(), dur = 1100;
  const step = t => { const p = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-p,3); num.textContent = Math.round(rec.v*e);
    if(p<1){ hypeRaf = requestAnimationFrame(step); } else { hypeRaf = null; if(rec.v>=HYPE_THRESHOLD && rec.v!==HYPE_CURSED) hypeSparks(sec); } };
  hypeRaf = requestAnimationFrame(step);
}

async function hypeBoot(){
  const key = localStorage.getItem(HYPE_LS);
  const sec = document.getElementById('hypeHome');
  if(!key){
    hypeActiveKey = null; hypeRecord = null;
    sec.hidden = false;
    sec.innerHTML = hypeLockedTemplate();
    document.getElementById('hypeLoginBtn').addEventListener('click', () => {
      const btn = document.getElementById('cabinetBtn');
      if(btn) btn.click();
    });
    return;
  }
  if(hypeBusy || (key===hypeActiveKey && hypeRecord)) return;
  hypeBusy = true; hypeActiveKey = key;
  sec.hidden = false; sec.innerHTML = '<div class="hype-loading">🔥 Крутим хайп…</div>';
  try{
    const rec = await hypeLoad(key);
    if(localStorage.getItem(HYPE_LS) !== key){ hypeBusy=false; hypeBoot(); return; }
    hypeRecord = rec; hypeRender(rec, key);
  }catch(e){ console.error(e); sec.innerHTML = '<div class="hype-loading">Не удалось загрузить хайп 😢</div>'; }
  hypeBusy = false;
}

async function hypeReroll(key){
  if(hypeBusy) return; hypeBusy = true;
  try{
    const rec = await hypeLoad(key);
    if(localStorage.getItem(HYPE_LS) !== key){ hypeBusy=false; hypeBoot(); return; }
    hypeRecord = rec; hypeRender(rec, key);
  }catch(e){ console.error(e); }
  hypeBusy = false;
}

function hypeTick(){
  const key = localStorage.getItem(HYPE_LS);
  if(key !== hypeActiveKey){ hypeBoot(); return; }
  if(!key || !hypeRecord) return;
  const now = Date.now(), b = Math.floor(now / HYPE_WINDOW_MS);
  if(b !== hypeRecord.bucket){ hypeReroll(key); return; }
  const cd = document.querySelector('#hypeHome .hype-countdown');
  if(cd) cd.textContent = hypeFmt((b+1)*HYPE_WINDOW_MS - now);
}

document.addEventListener('DOMContentLoaded', () => {
  hypeBoot();
  setInterval(hypeTick, 1000);
  window.addEventListener('storage', hypeBoot);
});
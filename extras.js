'use strict';

const EX_URL = String.fromCharCode(104,116,116,112,115,58,47,47,118,111,116,101,45,49,53,51,53,45,115,97,98,108,45,100,101,102,97,117,108,116,45,114,116,100,98,46,101,117,114,111,112,101,45,119,101,115,116,49,46,102,105,114,101,98,97,115,101,100,97,116,97,98,97,115,101,46,97,112,112);
const EX_LS = 'sabl2027_auth_user';
const EX_DAY_MS = 24*60*60*1000;
const EX_WEEK_MS = 7*EX_DAY_MS;
const EX_MSK = 3*60*60*1000;
const EX_MONDAY_SHIFT = 4*EX_DAY_MS;
function exDay(now){ return Math.floor((now + EX_MSK)/EX_DAY_MS); }
function exWeek(now){ return Math.floor((now + EX_MSK - EX_MONDAY_SHIFT)/EX_WEEK_MS); }
function exNextDay(now){ return (exDay(now)+1)*EX_DAY_MS - EX_MSK; }
function exNextWeek(now){ return (exWeek(now)+1)*EX_WEEK_MS + EX_MONDAY_SHIFT - EX_MSK; }

const HORO_TITLES = ['День легендарного завоза','День тихого гения','День случайной харизмы','День великого фейла','День неоценённого прайма','День шёпота за последней партой','День внезапной славы','День, когда всё по плану (почти)'];
const HORO_PREDS = [
  'Сегодня твоя фраза уйдёт в цитаты класса раньше, чем ты договоришь.',
  'Учитель вызовет не тебя, но отвечать всё равно будешь ты.',
  'Твой бутерброд в столовой заметят сильнее, чем твой ответ у доски.',
  'Кто-то из параллели сегодня повторит твой мем. Прости и забудь.',
  'Твоя домашка станет легендой: её будут пересказывать, но не сдавать.',
  'Сегодня «я просто зашёл посмотреть» превращается в «я теперь тут главный».',
  'Твой взгляд на контрольной скажет больше, чем весь конспект.',
  'Тебе предложат «помочь организовать». Соглашайся: ловушка, но почётная.'
];
const HORO_TALIS = ['SABL KING','SABL QUEEN','Человек-мем года','Лучший завозёр','Прайм года','Харизма года','Воздухан года','Стиль года','Пара года','Партия года','Событие года','Фейл года'];
const HORO_ADVICE = [
  'Не садись на своё «счастливое» место — сегодня оно несчастливое.',
  'Скажи это вслух: через неделю это будет крылатой фразой.',
  'Держи телефон заряженным: сегодня случится то, что надо заснять.',
  'Не спорь с завозёром. Завозёр всегда прав.',
  'Сегодня лучше промолчать. Но ты же не будешь.',
  'Запиши идею до перемены, иначе её заберут.',
  'Улыбнись первому встречному — это окупится на НВЛ.'
];
const ANON_NAMES = ['Анонимус','Тот-кого-нельзя-называть','Секретный агент','Человек-невидимка','Товарищ X','Засекреченный товарищ','Никто из ниоткуда'];

let topRows = null, topProfiles = {}, topWeek = -1, horoDay = -1, quoteDay = -1, quoteData = null, lastLs = null;

function exGet(p){ return fetch(EX_URL+p).then(r=>r.ok?r.json():null).catch(()=>null); }
function exArr(x){ if(!x) return []; if(Array.isArray(x)) return x; return Object.keys(x).sort((a,b)=>Number(a)-Number(b)).map(k=>x[k]); }
function exEsc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function exPick(rng, arr){ return arr[Math.floor(rng()*arr.length)]; }
function exAlias(key){ return exPick(window.hypeRng(key+'#anon'+exWeek(Date.now())), ANON_NAMES); }
window.exAlias = exAlias;

/* ---------- ТОП НЕДЕЛИ ---------- */
async function loadTop(){
  const [auth, awards, profiles] = await Promise.all([exGet('/auth_2027.json'), exGet('/awards_2027.json'), exGet('/profiles_2027.json')]);
  if(!auth){ document.getElementById('topWeek').innerHTML=''; return; }
  topProfiles = profiles || {};
  const week = exWeek(Date.now());
  topRows = Object.keys(auth).map(k => ({ key:k, v: window.hypeRoll(k, '#w'+week, exArr(awards && awards[k])) }))
    .sort((a,b)=> b.v-a.v || a.key.localeCompare(b.key,'ru'));
  topWeek = week;
  renderTop();
}
window.exRefreshTop = loadTop;

function renderTop(){
  const sec = document.getElementById('topWeek');
  if(!topRows){ sec.innerHTML=''; return; }
  const key = localStorage.getItem(EX_LS);
  const top10 = topRows.slice(0,10);
  const myIdx = key ? topRows.findIndex(r=>r.key===key) : -1;
  const rows = top10.map((r,i)=>topRowHtml(r,i,i===myIdx)).join('');
  const extra = (myIdx >= 10) ? topRowHtml(topRows[myIdx], myIdx, true) : '';
  sec.innerHTML = `<div class="topweek-card">
    <div class="topweek-head">
      <h2>🏆 Топ недели</h2>
      <span class="topweek-week">неделя #${topWeek % 52 + 1}</span>
      <span class="topweek-countdown" title="Обновление по понедельникам в 00:00 МСК">до смены: <b class="topweek-cd">…</b></span>
    </div>
    <ol class="topweek-list">${rows}${extra}</ol>
    ${ key ? '' : `<p class="topweek-note">Войди, чтобы увидеть своё место в топе.<br><button type="button" id="topLoginBtn">Войти / Зарегистрироваться</button></p>` }
  </div>`;
  const btn = document.getElementById('topLoginBtn');
  if(btn) btn.addEventListener('click', ()=>{ const b=document.getElementById('cabinetBtn'); if(b) b.click(); });
  exTopCd();
}

function topRowHtml(r, i, me){
  const [fio, cls] = r.key.split('|');
  const anon = topProfiles[r.key] && topProfiles[r.key].anon;
  const name = anon ? exAlias(r.key) : fio;
  const t = i<3 ? ' t'+(i+1) : '';
  return `<li class="topweek-row${t}${me?' me':''}" style="animation-delay:${Math.min(i,10)*60}ms">
    <span class="topweek-rank">${String(i+1).padStart(2,'0')}</span>
    <span class="topweek-name">${exEsc(name)}<i class="topweek-cls">${exEsc(cls||'')}</i>${me?'<b class="topweek-me">это ты</b>':''}</span>
    <span class="topweek-val">${r.v}</span>
  </li>`;
}

function exTopCd(){
  const el = document.querySelector('#topWeek .topweek-cd');
  if(!el) return;
  const now = Date.now(), left = exNextWeek(now)-now;
  const d = Math.floor(left/86400000), h = Math.floor(left%86400000/3600000), m = Math.floor(left%3600000/60000);
  el.textContent = d+'д '+String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
}

/* ---------- ГОРОСКОП ---------- */
function horoFor(key, now){
  const day = exDay(now);
  const rng = window.hypeRng(key + '#day' + day);
  return { day, title: exPick(rng,HORO_TITLES), pred: exPick(rng,HORO_PREDS), tal: exPick(rng,HORO_TALIS), num: 1+Math.floor(rng()*100), adv: exPick(rng,HORO_ADVICE) };
}
function renderHoro(){
  const sec = document.getElementById('horoscopeHome');
  const key = localStorage.getItem(EX_LS);
  if(!key){ sec.hidden=true; sec.innerHTML=''; horoDay=-1; return; }
  const now = Date.now(), h = horoFor(key, now);
  horoDay = h.day;
  const date = new Date(now+EX_MSK).toLocaleDateString('ru-RU',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long'});
  sec.hidden = false;
  sec.innerHTML = `<div class="horo-card">
    <div class="horo-head"><span class="horo-icon">🔮</span>
      <div><h3>SABL-гороскоп на сегодня</h3><p class="horo-date">${exEsc(date)}</p></div>
      <span class="horo-timer" title="Обновление ежедневно в 00:00 МСК">новое через <b class="horo-cd">…</b></span></div>
    <div class="horo-title">${exEsc(h.title)}</div>
    <p class="horo-pred">${exEsc(h.pred)}</p>
    <div class="horo-chips"><span class="horo-chip">талисман дня: ${exEsc(h.tal)}</span><span class="horo-chip num">число дня: <b>${h.num}</b></span></div>
    <p class="horo-adv">Совет: ${exEsc(h.adv)}</p></div>`;
  exHoroCd();
}
function exHoroCd(){
  const el = document.querySelector('#horoscopeHome .horo-cd');
  if(!el) return;
  const left = exNextDay(Date.now())-Date.now();
  const p = n=>String(n).padStart(2,'0');
  el.textContent = p(Math.floor(left/3600000))+':'+p(Math.floor(left%3600000/60000))+':'+p(Math.floor(left%60000/1000));
}

/* ---------- ЦИТАТА ДНЯ ---------- */
async function loadQuote(){
  const [qs, cur] = await Promise.all([exGet('/quotes_2027.json'), exGet('/quote_of_day_2027.json')]);
  const list = exArr(qs).filter(q=>q && q.text);
  const day = exDay(Date.now());
  let pick = null;
  if(cur && cur.d===day && list[cur.i] && list[cur.i].text===cur.text){ pick = cur; }
  else if(list.length){
    const rng = window.hypeRng('quote#'+day);
    let i = Math.floor(rng()*list.length);
    if(cur && typeof cur.i==='number' && list.length>1 && i===cur.i) i = (i+1)%list.length;
    pick = { d:day, i, text:list[i].text, author:list[i].author||'аноним' };
    try{ await fetch(EX_URL+'/quote_of_day_2027.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(pick)}); }catch(e){}
  }
  quoteData = { list, pick };
  quoteDay = day;
  renderQuote();
}
function renderQuote(){
  const sec = document.getElementById('quoteHome');
  if(!sec) return;
  const date = new Date(Date.now()+EX_MSK).toLocaleDateString('ru-RU',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long'});
  const head = `<div class="quote-head"><span class="quote-icon">💬</span>
    <div><h3>Цитата дня</h3><p class="quote-date">${exEsc(date)}</p></div>
    <span class="quote-timer" title="Новая цитата в 00:00 МСК">новая через <b class="quote-cd">…</b></span></div>`;
  if(!quoteData || !quoteData.pick){
    sec.innerHTML = `<div class="quote-card">${head}
      <p class="quote-text">«Цитат пока нет. Класс молчит — подозрительно.»</p>
      <p class="quote-author">— пока тишина в классе</p>
      <div class="quote-foot"><span class="quote-count">цитат в архиве: 0</span><button type="button" id="quoteAddBtn">Быть первым</button></div></div>`;
  } else {
    const p = quoteData.pick;
    sec.innerHTML = `<div class="quote-card">${head}
      <p class="quote-text">«${exEsc(p.text)}»</p>
      <p class="quote-author">— ${exEsc(p.author)}</p>
      <div class="quote-foot"><span class="quote-count">цитат в архиве: ${quoteData.list.length}</span><button type="button" id="quoteAddBtn">Добавить свою</button></div></div>`;
  }
  const btn = document.getElementById('quoteAddBtn');
  if(btn) btn.addEventListener('click', ()=>{ const b=document.getElementById('cabinetBtn'); if(b) b.click(); });
  exQuoteCd();
}
function exQuoteCd(){
  const el = document.querySelector('#quoteHome .quote-cd');
  if(!el) return;
  const left = exNextDay(Date.now())-Date.now();
  const p = n=>String(n).padStart(2,'0');
  el.textContent = p(Math.floor(left/3600000))+':'+p(Math.floor(left%3600000/60000))+':'+p(Math.floor(left%60000/1000));
}

/* ---------- ЖИЗНЕННЫЙ ЦИКЛ ---------- */
function exTick(){
  const key = localStorage.getItem(EX_LS);
  if(key !== lastLs){ lastLs = key; renderTop(); renderHoro(); }
  const now = Date.now();
  const w = exWeek(now);
  if(w !== topWeek) loadTop(); else exTopCd();
  const d = exDay(now);
  if(key && d !== horoDay) renderHoro(); else exHoroCd();
  if(d !== quoteDay) loadQuote(); else exQuoteCd();
}

document.addEventListener('DOMContentLoaded', () => {
  lastLs = localStorage.getItem(EX_LS);
  loadTop(); renderHoro(); loadQuote();
  setInterval(exTick, 1000);
  window.addEventListener('storage', () => { lastLs = localStorage.getItem(EX_LS); loadTop(); renderHoro(); loadQuote(); });
});
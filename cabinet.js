'use strict';

const CAB_ORG_TG = 'https://t.me/sergeev_m1kha1l';
const CAB_PIC_DIR = 'nom_pic_2027/';
const CAB_NOM_PICS = {
  'sabl king': 'sabl-king.png',
  'sabl queen': 'sabl-queen.png',
  'человек-мем года': 'sabl-mem.png',
  'пара года': 'sabl-para-goda.png',
  'партия года': 'sabl-partia-goda.png',
  'прайм года': 'sabl-praim.png',
  'событие года': 'sabl-sobutia.png',
  'стиль года': 'sabl-style.png',
  'учителя года': 'sabl-teachers.png',
  'учитель года': 'sabl-teachers.png',
  'воздухан года': 'sabl-vozdyx.png',
  'харизма года': 'sabl-xarizma.png',
  'лучший завозёр': 'sabl-zavoz.png',
  'лучший завозер': 'sabl-zavoz.png',
};
function cabPicFor(a){
  if(a.img) return CAB_PIC_DIR + a.img;
  const k = String(a.nom||'').toLowerCase().replace(/\s+/g,' ').trim();
  return CAB_NOM_PICS[k] ? CAB_PIC_DIR + CAB_NOM_PICS[k] : null;
}

const CAB_URL = String.fromCharCode(104,116,116,112,115,58,47,47,118,111,116,101,45,49,53,51,53,45,115,97,98,108,45,100,101,102,97,117,108,116,45,114,116,100,98,46,101,117,114,111,112,101,45,119,101,115,116,49,46,102,105,114,101,98,97,115,101,100,97,116,97,98,97,115,101,46,97,112,112);
const CAB_AUTH = '/auth_2027', CAB_AWARDS = '/awards_2027';
const CAB_LS = 'sabl2027_auth_user';
let cabKey = localStorage.getItem(CAB_LS) || null;

async function cabGet(p){ try{ const r = await fetch(CAB_URL+p); return r.ok ? r.json() : null; }catch(e){ return null; } }
async function cabPut(p,d){
  try{
    const r = await fetch(CAB_URL+p,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
    if(!r.ok){
      const body = await r.text().catch(()=>'');
      console.error('Firebase write error', r.status, body);
      alert('Запись отклонена. Код: '+r.status+(r.status===401||r.status===403 ? ' → нет ".write" для этого узла в Rules' : ''));
    }
    return r.ok;
  }catch(e){ console.error(e); alert('Сетевая ошибка: '+e.message); return false; }
}
function cabToArray(x){ if(!x) return []; if(Array.isArray(x)) return x; return Object.keys(x).sort((a,b)=>Number(a)-Number(b)).map(k=>x[k]); }
function cabEsc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function cabOpen(){ document.getElementById('cabinetOverlay').classList.add('active'); document.body.classList.add('modal-open'); cabRender(); }
function cabClose(){ document.getElementById('cabinetOverlay').classList.remove('active'); document.body.classList.remove('modal-open'); }

function cabSpark(hist){
  if(!hist.length) return '<p class="cab-empty">График появится после первого обновления хайпа.</p>';
  if(hist.length===1) return '<p class="cab-empty">Одна точка: '+hist[0].v+'. График наберётся за следующие окна (16 окон ≈ сутки).</p>';
  const W=320,H=96,P=10;
  const vs=hist.map(h=>h.v);
  const min=Math.min.apply(null,vs), max=Math.max.apply(null,vs);
  const span=Math.max(1,max-min);
  const pts=vs.map((v,i)=>[P+i*(W-2*P)/(vs.length-1), H-P-(v-min)*(H-2*P)/span]);
  const line=pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const area=line+' '+(W-P)+','+(H-P)+' '+P+','+(H-P);
  return '<div class="cab-spark"><svg viewBox="0 0 '+W+' '+H+'">'+
    '<defs><linearGradient id="cabSparkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,77,0,.45)"/><stop offset="1" stop-color="rgba(255,77,0,0)"/></linearGradient></defs>'+
    '<line x1="'+P+'" y1="'+(H-P)+'" x2="'+(W-P)+'" y2="'+(H-P)+'" class="cab-spark-base"/>'+
    '<polygon points="'+area+'" fill="url(#cabSparkGrad)"/>'+
    '<polyline points="'+line+'" class="cab-spark-line"/>'+
    pts.map((p,i)=>'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(i===pts.length-1?4:2.2)+'" class="cab-spark-dot'+(i===pts.length-1?' last':'')+'"/>').join('')+
    '</svg><div class="cab-spark-meta"><span>мин '+min+'</span><span>макс '+max+'</span><span>сейчас '+vs[vs.length-1]+'</span><span>'+hist.length+' окон ≈ '+Math.round(hist.length*1.5)+' ч</span></div></div>';
}

async function cabRender(){
  const body = document.getElementById('cabinetBody');
  if(!cabKey){ cabRenderLogin(body); return; }
  const enc = encodeURIComponent(cabKey);
  const [auth, awards, hypeRec, profile, authAll] = await Promise.all([
    cabGet(CAB_AUTH+'/'+enc+'.json'),
    cabGet(CAB_AWARDS+'/'+enc+'.json'),
    cabGet('/hype_2027/'+enc+'.json'),
    cabGet('/profiles_2027/'+enc+'.json'),
    cabGet('/auth_2027.json')
  ]);
  const userNames = Object.keys(authAll||{}).map(k=>k.split('|')[0]);
  if(auth === null || auth === undefined){ cabKey=null; localStorage.removeItem(CAB_LS); cabRenderLogin(body); return; }
  const [fio, cls] = cabKey.split('|');
  const myAwards = cabToArray(awards);
  const anon = !!(profile && profile.anon);
  let crest = null, bestW = -1;
  myAwards.forEach(a=>{
    const p = cabPicFor(a); if(!p) return;
    const w = (typeof hypeBonusFor==='function') ? hypeBonusFor(a.nom) : 3;
    if(w>bestW){ bestW=w; crest=p; }
  });
  const hist = (hypeRec && Array.isArray(hypeRec.hist) && hypeRec.hist.length) ? hypeRec.hist
             : (hypeRec && typeof hypeRec.v==='number' ? [{b:hypeRec.bucket, v:hypeRec.v}] : []);
  const alias = window.exAlias ? window.exAlias(cabKey) : 'Анонимус';

  body.innerHTML = `
    <div class="cab-id">
      <div class="cab-avatar${crest?' has-crest':''}"><span>${cabEsc((fio.trim()[0]||'?').toUpperCase())}</span>${crest?`<img src="${cabEsc(crest)}" alt="" onerror="this.parentNode.classList.remove('has-crest');this.remove();">`:''}</div>
      <div><h2>${cabEsc(fio)}</h2><span class="cab-class">${cabEsc(cls||'')}</span>${anon?'<span class="cab-anon-badge">🕶 инкогнито</span>':''}</div>
    </div>
    <div class="cab-section"><h3>📈 График хайпа</h3>${cabSpark(hist)}</div>
    <div class="cab-section"><h3>🏆 Мои награды</h3>
      ${ myAwards.length ? `<div class="cab-awards">${myAwards.map(a=>{
          const pic = cabPicFor(a);
          return `<div class="cab-award-card${pic?' has-pic':''}">
            <span class="year">${cabEsc(a.year||'')}</span>
            ${pic?`<div class="cab-award-pic"><img src="${cabEsc(pic)}" alt="${cabEsc(a.nom||'')}" loading="lazy"
              onerror="var c=this.closest('.cab-award-card');c.classList.remove('has-pic');this.parentNode.remove();"></div>`:''}
            <p>${cabEsc(a.nom||'')}</p></div>`;
        }).join('')}</div>`
        : `<p class="cab-empty">Пока пусто. Награды выдаёт организатор через админ-панель 😉</p>` }
    </div>
    <div class="cab-section"><h3>💬 Отправить цитату</h3>
      <form id="cabQuoteForm" class="cab-quote-form">
        <textarea id="cabQuoteText" maxlength="200" placeholder="Цитата, которую класс будет помнить (до 200 символов)" required></textarea>
        <input type="text" id="cabQuoteAuthor" list="cabQuoteAuthors" maxlength="60" placeholder="Чья цитата? Оставь пустым — будет твоя">
        <datalist id="cabQuoteAuthors">${userNames.map(n=>`<option value="${cabEsc(n)}">`).join('')}</datalist>
        <button type="submit">Отправить на модерацию</button>
      </form>
      <p class="cab-empty" style="margin-top:10px">После отправки цитата появится в общем архиве после одобрения организатором. Полный список цитат доступен только в админ-панели.</p>
    </div>
    <div class="cab-section"><h3>🕶 Приватность</h3>
      <div class="cab-privacy">
        <label class="cab-switch"><input type="checkbox" id="cabAnon" ${anon?'checked':''}><i></i></label>
        <div><p>Скрывать имя в топе недели</p><p class="cab-empty">В топе ты будешь виден как «${cabEsc(alias)}». Никто не узнает, что это ты. Кроме тех, кто знает.</p></div>
      </div>
    </div>
    <button class="cab-logout" id="cabLogoutBtn">Выйти</button>`;

  document.getElementById('cabLogoutBtn').addEventListener('click', ()=>{ cabKey=null; localStorage.removeItem(CAB_LS); cabRenderLogin(body); });

  document.getElementById('cabQuoteForm').addEventListener('submit', async e=>{
    e.preventDefault();
    const text = document.getElementById('cabQuoteText').value.trim();
    if(!text) return;
    const author = document.getElementById('cabQuoteAuthor').value.trim() || fio;
    const list = cabToArray(await cabGet('/quotes_pending_2027.json'));
    list.push({ text, author, key: cabKey, t: Date.now() });
    const ok = await cabPut('/quotes_pending_2027.json', list);
    if(ok){
      document.getElementById('cabQuoteText').value = '';
      document.getElementById('cabQuoteAuthor').value = '';
      cabRender();
    }
  });
  
  document.getElementById('cabAnon').addEventListener('change', async e=>{
    if(await cabPut('/profiles_2027/'+enc+'.json', { anon: e.target.checked })){
      if(window.exRefreshTop) window.exRefreshTop();
      cabRender();
    }
  });
}

function cabRenderLogin(body){
  let mode = 'login';
  body.innerHTML = `
    <div class="cab-login">
      <h2>Личный кабинет</h2>
      <div class="cab-tabs">
        <button type="button" id="cabTabLogin" class="on">Вход</button>
        <button type="button" id="cabTabReg">Регистрация</button>
      </div>
      <p class="cab-empty" id="cabHint" style="margin:0 0 12px">Введи данные своего аккаунта</p>
      <form id="cabForm">
        <input type="text" id="cabName" placeholder="Фамилия Имя" required autocomplete="off">
        <input type="text" id="cabClass" placeholder="Класс (например: 11В)" required autocomplete="off">
        <input type="password" id="cabPass" placeholder="Пароль" required>
        <div class="cab-error" id="cabError"></div>
        <button type="submit" id="cabSubmit">Войти</button>
      </form>
      <p class="cab-help">Забыл логин или пароль? <a href="${CAB_ORG_TG}" target="_blank">Напиши организатору в Telegram</a> — он посмотрит в базе и сбросит пароль.</p>
    </div>`;
  const setMode = m => {
    mode = m;
    document.getElementById('cabTabLogin').classList.toggle('on', m==='login');
    document.getElementById('cabTabReg').classList.toggle('on', m==='reg');
    document.getElementById('cabSubmit').textContent = m==='login' ? 'Войти' : 'Создать аккаунт';
    document.getElementById('cabHint').textContent = m==='login' ? 'Введи данные своего аккаунта' : 'Новый аккаунт: ФИО и класс должны быть точными, как у организатора в списке';
    document.getElementById('cabError').textContent = '';
  };
  document.getElementById('cabTabLogin').addEventListener('click', ()=>setMode('login'));
  document.getElementById('cabTabReg').addEventListener('click', ()=>setMode('reg'));

  document.getElementById('cabForm').addEventListener('submit', async e => {
    e.preventDefault();
    const err = document.getElementById('cabError');
    const name = document.getElementById('cabName').value.trim();
    const cls = document.getElementById('cabClass').value.trim().toUpperCase();
    const pass = document.getElementById('cabPass').value;
    if(!name || !cls || !pass){ err.textContent='Заполните все поля!'; return; }
    const key = `${name}|${cls}`, enc = encodeURIComponent(key);
    const stored = await cabGet(CAB_AUTH+'/'+enc+'.json');
    const exists = stored !== null && stored !== undefined;
    if(mode === 'login'){
      if(!exists){ err.textContent='❌ Аккаунт не найден. Проверь ФИО и класс (или зарегистрируйся, если тебя нет в списке).'; return; }
      if(String(stored) !== pass){ err.textContent='❌ Неверный пароль'; return; }
    } else {
      if(exists){ err.textContent='❌ Такой аккаунт уже есть — переключись на «Вход»'; return; }
      if(name.length < 3){ err.textContent='ФИО слишком короткое'; return; }
      if(pass.length < 4){ err.textContent='Пароль минимум 4 символа'; return; }
      const ok = await cabPut(CAB_AUTH+'/'+enc+'.json', pass);
      if(!ok){ err.textContent='❌ Не удалось зарегистрироваться: запись в базу закрыта. Сообщи организатору.'; return; }
    }
    cabKey = key; localStorage.setItem(CAB_LS, key);
    await cabRender();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cabinetBtn').addEventListener('click', cabOpen);
  document.getElementById('cabinetClose').addEventListener('click', cabClose);
  document.getElementById('cabinetOverlay').addEventListener('click', e => { if(e.target.id==='cabinetOverlay') cabClose(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && document.getElementById('cabinetOverlay').classList.contains('active')) cabClose(); });
});
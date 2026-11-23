'use strict';

/* ⚙️ ТУТ ССЫЛКА НА ТВОЮ ЛИЧКУ В ТЕЛЕГРАМ (для «забыл пароль») — замени юзернейм на свой */
const CAB_ORG_TG = 'https://t.me/sergeev_m1kha1l';
/* ⚙️ Папка с картинками наград */
const CAB_PIC_DIR = 'nom_pic_2027/';
/* ⚙️ ТУТ ДОБАВЛЯТЬ СООТВЕТСТВИЯ: 'название номинации маленькими буквами' → файл из nom_pic_2027.
   Нет в списке и нет поля «Картинка» в админке — карточка текстовая, как раньше. */
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
const CAB_AUTH = '/auth_2027', CAB_AWARDS = '/awards_2027', CAB_VOTES = '/votes_2027_dop';
const CAB_LS = 'sabl2027_auth_user';
let cabKey = localStorage.getItem(CAB_LS) || null;

async function cabGet(p){ try{ const r = await fetch(CAB_URL+p); return r.ok ? r.json() : null; }catch(e){ return null; } }
async function cabPut(p,d){ try{ const r = await fetch(CAB_URL+p,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}); return r.ok; }catch(e){ return false; } }
function cabToArray(x){ if(!x) return []; if(Array.isArray(x)) return x; return Object.keys(x).sort((a,b)=>Number(a)-Number(b)).map(k=>x[k]); }
function cabEsc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function cabOpen(){ document.getElementById('cabinetOverlay').classList.add('active'); document.body.classList.add('modal-open'); cabRender(); }
function cabClose(){ document.getElementById('cabinetOverlay').classList.remove('active'); document.body.classList.remove('modal-open'); }

async function cabRender(){
  const body = document.getElementById('cabinetBody');
  if(!cabKey){ cabRenderLogin(body); return; }
  const enc = encodeURIComponent(cabKey);
  const [auth, awards, votes] = await Promise.all([cabGet(CAB_AUTH+'/'+enc+'.json'), cabGet(CAB_AWARDS+'/'+enc+'.json'), cabGet(CAB_VOTES+'/'+enc+'.json')]);
  if(auth === null || auth === undefined){ cabKey=null; localStorage.removeItem(CAB_LS); cabRenderLogin(body); return; }
  const [fio, cls] = cabKey.split('|');
  const myAwards = cabToArray(awards), myVotes = cabToArray(votes);
  body.innerHTML = `
    <div class="cab-id">
      <div class="cab-avatar">${cabEsc((fio.trim()[0]||'?').toUpperCase())}</div>
      <div><h2>${cabEsc(fio)}</h2><span class="cab-class">${cabEsc(cls||'')}</span></div>
    </div>
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
    <div class="cab-section"><h3>🗳 Моё голосование 2027</h3>
      ${ myVotes.length ? `<div class="cab-votes">${myVotes.map(v=>`<span class="cab-chip">${cabEsc(v)}</span>`).join('')}</div>` : `<p class="cab-empty">Голос в базе не найден.</p>` }
    </div>
    <button class="cab-logout" id="cabLogoutBtn">Выйти</button>`;
  document.getElementById('cabLogoutBtn').addEventListener('click', ()=>{ cabKey=null; localStorage.removeItem(CAB_LS); cabRenderLogin(body); });
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
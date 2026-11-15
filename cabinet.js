'use strict';

const CAB_URL = String.fromCharCode(104,116,116,112,115,58,47,47,118,111,116,101,45,49,53,51,53,45,115,97,98,108,45,100,101,102,97,117,108,116,45,114,116,100,98,46,101,117,114,111,112,101,45,119,101,115,116,49,46,102,105,114,101,98,97,115,101,100,97,116,97,98,97,115,101,46,97,112,112);
const CAB_AUTH   = '/auth_2027.json';
const CAB_AWARDS = '/awards_2027.json';
const CAB_VOTES  = '/votes_2027_dop.json';
const CAB_LS     = 'sabl2027_auth_user';

let cabKey = localStorage.getItem(CAB_LS) || null;

/* ============ ХЕЛПЕРЫ ============ */
async function cabGet(path){
  try{ const r = await fetch(CAB_URL + path); return r.ok ? await r.json() : null; }
  catch(e){ console.error('cabGet', e); return null; }
}
async function cabPut(path, data){
  try{
    const r = await fetch(CAB_URL + path, {
      method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    return r.ok;
  }catch(e){ console.error('cabPut', e); return false; }
}
function cabToArray(x){
  if(!x) return [];
  if(Array.isArray(x)) return x;
  return Object.keys(x).sort((a,b)=>Number(a)-Number(b)).map(k=>x[k]);
}
function cabEsc(s){
  return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ============ ОТКРЫТЬ / ЗАКРЫТЬ ============ */
function cabOpen(){
  document.getElementById('cabinetOverlay').classList.add('active');
  document.body.classList.add('modal-open'); // блокировка скролла — как у модалок голосования
  cabRender();
}
function cabClose(){
  document.getElementById('cabinetOverlay').classList.remove('active');
  document.body.classList.remove('modal-open');
}

/* ============ РЕНДЕР ============ */
async function cabRender(){
  const body = document.getElementById('cabinetBody');
  if(!cabKey){ cabRenderLogin(body); return; }

  const [auth, awards, votes] = await Promise.all([
    cabGet(CAB_AUTH), cabGet(CAB_AWARDS), cabGet(CAB_VOTES)
  ]);

  if(!auth || !(cabKey in auth)){
    cabKey = null; localStorage.removeItem(CAB_LS);
    cabRenderLogin(body); return;
  }

  const [fio, cls] = cabKey.split('|');
  const myAwards = cabToArray(awards && awards[cabKey]);
  const myVotes  = cabToArray(votes  && votes[cabKey]);

  body.innerHTML = `
    <div class="cab-id">
      <div class="cab-avatar">${cabEsc((fio.trim()[0] || '?').toUpperCase())}</div>
      <div>
        <h2>${cabEsc(fio)}</h2>
        <span class="cab-class">${cabEsc(cls || '')}</span>
      </div>
    </div>

    <div class="cab-section">
      <h3>🏆 Мои награды</h3>
      ${ myAwards.length
        ? `<div class="cab-awards">${myAwards.map(a => `
            <div class="cab-award-card">
              <span class="year">${cabEsc(a.year || '')}</span>
              <p>${cabEsc(a.nom || '')}</p>
            </div>`).join('')}</div>`
        : `<p class="cab-empty">Пока пусто. Не переживай, скоро ты получишь свою первую награду</p>` }
    </div>

    <div class="cab-section">
      <h3>🗳 Моё голосование 2027</h3>
      ${ myVotes.length
        ? `<div class="cab-votes">${myVotes.map(v => `<span class="cab-chip">${cabEsc(v)}</span>`).join('')}</div>`
        : `<p class="cab-empty">Голос в базе не найден.</p>` }
    </div>

    <button class="cab-logout" id="cabLogoutBtn">Выйти</button>`;

  document.getElementById('cabLogoutBtn').addEventListener('click', () => {
    cabKey = null; localStorage.removeItem(CAB_LS);
    cabRenderLogin(body);
  });
}

/* ============ ВХОД (без регистрации — только сверка с auth_2027) ============ */
function cabRenderLogin(body){
  body.innerHTML = `
    <div class="cab-login">
      <h2>Личный кабинет</h2>
      <p class="cab-empty" style="margin:10px 0 16px">Войди, чтобы посмотреть свои награды</p>
      <form id="cabForm">
        <input type="text" id="cabName" placeholder="Фамилия Имя" required autocomplete="off">
        <input type="text" id="cabClass" placeholder="Класс (например: 11В)" required autocomplete="off">
        <input type="password" id="cabPass" placeholder="Пароль" required>
        <div class="cab-error" id="cabError"></div>
        <button type="submit">Войти</button>
      </form>
    </div>`;

  document.getElementById('cabForm').addEventListener('submit', async e => {
    e.preventDefault();
    const err = document.getElementById('cabError');
    const name = document.getElementById('cabName').value.trim();
    const cls  = document.getElementById('cabClass').value.trim().toUpperCase();
    const pass = document.getElementById('cabPass').value;
    if(!name || !cls || !pass){ err.textContent = 'Заполните все поля!'; return; }

    const key = `${name}|${cls}`;
    const auth = await cabGet(CAB_AUTH);
    if(!auth || !(key in auth)){
      err.textContent = 'Пользователь не найден. Проверь ФИО и класс (как при регистрации).';
      return;
    }
    if(String(auth[key]) !== pass){ err.textContent = '❌ Неверный пароль'; return; }

    cabKey = key;
    localStorage.setItem(CAB_LS, key);
    await cabRender();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cabinetBtn').addEventListener('click', cabOpen);
  document.getElementById('cabinetClose').addEventListener('click', cabClose);
  document.getElementById('cabinetOverlay').addEventListener('click', e => {
    if(e.target.id === 'cabinetOverlay') cabClose();
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && document.getElementById('cabinetOverlay').classList.contains('active')) cabClose();
  });
});
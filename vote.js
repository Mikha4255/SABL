const FIREBASE_URL = String.fromCharCode(104,116,116,112,115,58,47,47,118,111,116,101,45,49,53,51,53,45,115,97,98,108,45,100,101,102,97,117,108,116,45,114,116,100,98,46,101,117,114,111,112,101,45,119,101,115,116,49,46,102,105,114,101,98,97,115,101,100,97,116,97,98,97,115,101,46,97,112,112);
const AUTH_PATH = String.fromCharCode(47,97,117,116,104,95,50,48,50,55,46,106,115,111,110);
const VOTES_PATH = String.fromCharCode(47,118,111,116,101,115,95,50,48,50,55,95,100,111,112,46,106,115,111,110);
const SUGGESTIONS_PATH = String.fromCharCode(47,115,117,103,103,101,115,116,105,111,110,115,95,50,48,50,55,95,100,111,112,46,106,115,111,110);
const NOMS_LIST_PATH = String.fromCharCode(47,110,111,109,115,95,50,48,50,55,95,108,105,115,116,46,106,115,111,110);
const LOCAL_AUTH_KEY = String.fromCharCode(115,97,98,108,50,48,50,55,95,97,117,116,104,95,117,115,101,114);

const VOTE_START_TIME = new Date('2026-10-26T00:00:00+03:00').getTime();
const VOTE_END_TIME = new Date('2026-11-06T23:59:59+03:00').getTime();

function getVotingPhase() {
    const now = Date.now();
    if (now < VOTE_START_TIME) return 'before';
    if (now > VOTE_END_TIME) return 'after';
    return 'active';
}

function isVotingActive() {
    return getVotingPhase() === 'active';
}

function getVotingStatusMessage() {
    const phase = getVotingPhase();
    if (phase === 'before') {
        const daysLeft = Math.ceil((VOTE_START_TIME - Date.now()) / (1000 * 60 * 60 * 24));
        return `Голосование ещё не началось. Старт: 26 октября 2026 (осталось ${daysLeft} дн.)`;
    } else if (phase === 'after') {
        return 'Голосование завершено 6 ноября 2026 в 23:59.';
    }
    return null;
}

function firebaseToArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return Object.keys(data).sort((a, b) => Number(a) - Number(b)).map(key => data[key]);
}

let dynamicNomsList = []; 
let currentUserKey = null;
let currentVotes = [];
let userSuggestions = [];

async function fetchData(path) {
    try {
        const res = await fetch(FIREBASE_URL + path);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { console.error("Firebase read error:", e); return null; }
}

async function sendData(path, data) {
    try {
        await fetch(FIREBASE_URL + path, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return true;
    } catch (e) { console.error("Firebase write error:", e); return false; }
}

window.addEventListener('DOMContentLoaded', async () => {
    const nomsData = await fetchData(NOMS_LIST_PATH);
    dynamicNomsList = firebaseToArray(nomsData);

    const savedUser = localStorage.getItem(LOCAL_AUTH_KEY);
    if (savedUser) {
        currentUserKey = savedUser;
    }
    const btn = document.getElementById('openVoteBtn');
    if (btn) {
        const phase = getVotingPhase();
        
        if (phase === 'before') {
            const daysLeft = Math.ceil((VOTE_START_TIME - Date.now()) / (1000 * 60 * 60 * 24));
            btn.textContent = ` Голосование откроется через ${daysLeft} дн.`;
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        } else if (phase === 'after') {
            btn.textContent = '✅ Голосование завершено';
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.textContent = currentUserKey ? 'Изменить выбор' : 'Начать голосование';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }
});

const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authError = document.getElementById('authError');
const voteModal = document.getElementById('voteModal');

function closeAllModals() {
    authModal.classList.remove('active');
    voteModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

document.getElementById('closeAuthBtn')?.addEventListener('click', closeAllModals);
document.getElementById('closeVoteBtn')?.addEventListener('click', closeAllModals);

document.querySelectorAll('.vote-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
        closeAllModals();
    }
});

document.getElementById('openVoteBtn')?.addEventListener('click', async () => {
    const statusMsg = getVotingStatusMessage();
    if (statusMsg) {
        alert('⏰ ' + statusMsg);
        return;
    }

    if (currentUserKey) {
        await loadUserData();
        openVoteModal();
    } else {
        authModal.classList.add('active');
        document.body.classList.add('modal-open');
        authError.textContent = '';
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('authName').value.trim();
    const cls = document.getElementById('authClass').value.trim().toUpperCase();
    const pass = document.getElementById('authPass').value;
    
    if (!name || !cls || !pass) { authError.textContent = 'Заполните все поля!'; return; }
    
    const key = `${name}|${cls}`;
    const authData = await fetchData(AUTH_PATH);
    
    if (authData && authData[key]) {
        if (authData[key] !== pass) { authError.textContent = '❌ Неверный пароль!'; return; }
    } else {
        const newAuth = authData || {};
        newAuth[key] = pass;
        await sendData(AUTH_PATH, newAuth);
    }
    
    currentUserKey = key;
    localStorage.setItem(LOCAL_AUTH_KEY, key);
    closeAllModals();
    await loadUserData();
    openVoteModal();
    document.getElementById('openVoteBtn').textContent = 'Изменить выбор';
});

async function loadUserData() {
    if (!currentUserKey) return;
    
    const votesData = await fetchData(VOTES_PATH);
    const rawVotes = (votesData && votesData[currentUserKey]) ? votesData[currentUserKey] : [];
    currentVotes = firebaseToArray(rawVotes);
    
    const suggData = await fetchData(SUGGESTIONS_PATH);
    const rawSugg = (suggData && suggData[currentUserKey]) ? suggData[currentUserKey] : [];
    userSuggestions = firebaseToArray(rawSugg);
    
    userSuggestions.forEach(s => {
        if (!currentVotes.includes(s)) currentVotes.push(s);
    });
}

const nomineesGrid = document.getElementById('nomineesGrid');
const voteCounter = document.getElementById('voteCounter');
const suggestInput = document.getElementById('suggestNomInput');
const suggestError = document.getElementById('suggestError');

function openVoteModal() {
    voteModal.classList.add('active');
    document.body.classList.add('modal-open');
    renderNominees();
    updateCounter();
}

function renderNominees() {
    nomineesGrid.innerHTML = '';
    dynamicNomsList.forEach(nom => { nomineesGrid.appendChild(createNomCard(nom, false)); });
    userSuggestions.forEach(nom => { nomineesGrid.appendChild(createNomCard(nom, true)); });
}

function createNomCard(name, isUserSuggested) {
    const div = document.createElement('div');
    div.className = 'nom-card';
    div.textContent = name;
    
    const isSelected = currentVotes.includes(name);
    if (isSelected) div.classList.add('selected');
    if (isUserSuggested) div.classList.add('user-suggested');
    
    div.addEventListener('click', () => toggleVote(name, div, isUserSuggested));
    return div;
}

function toggleVote(name, element, isUserSuggested) {
    const idx = currentVotes.indexOf(name);
    
    if (idx > -1) {
        currentVotes.splice(idx, 1);
        element.classList.remove('selected');
        
        if (isUserSuggested) {
            const suggIdx = userSuggestions.indexOf(name);
            if (suggIdx > -1) userSuggestions.splice(suggIdx, 1);
            element.remove();
            saveSuggestionsToFirebase();
        }
    } else {
        if (currentVotes.length >= 6) {
            alert('Можно выбрать максимум 6 номинаций! Сначала снимите одну.');
            return;
        }
        currentVotes.push(name);
        element.classList.add('selected');
    }
    updateCounter();
}

async function saveSuggestionsToFirebase() {
    if (!currentUserKey) return;
    const suggData = await fetchData(SUGGESTIONS_PATH) || {};
    if (userSuggestions.length === 0) delete suggData[currentUserKey];
    else suggData[currentUserKey] = userSuggestions;
    await sendData(SUGGESTIONS_PATH, suggData);
}

function updateCounter() {
    voteCounter.textContent = `Выбрано: ${currentVotes.length}/6`;
    document.getElementById('submitVoteBtn').disabled = currentVotes.length !== 6;
}

document.getElementById('suggestNomBtn')?.addEventListener('click', async () => {
    if (!isVotingActive()) {
        alert('⏰ Время голосования истекло! Предложения больше не принимаются.');
        return;
    }
    const val = suggestInput.value.trim();
    suggestError.textContent = '';
    
    if (!val) { suggestError.textContent = 'Введите название!'; return; }
    if (userSuggestions.length >= 3) { suggestError.textContent = 'Максимум 3 своих номинации!'; return; }
    
    const allNoms = [...dynamicNomsList, ...userSuggestions];
    if (allNoms.some(n => n.toLowerCase() === val.toLowerCase())) {
        suggestError.textContent = 'Такая номинация уже существует!'; return;
    }
    
    userSuggestions.push(val);
    currentVotes.push(val);
    
    const suggData = await fetchData(SUGGESTIONS_PATH) || {};
    suggData[currentUserKey] = userSuggestions;
    await sendData(SUGGESTIONS_PATH, suggData);
    
    suggestInput.value = '';
    renderNominees();
    updateCounter();
});

document.getElementById('submitVoteBtn')?.addEventListener('click', async () => {
    if (!isVotingActive()) {
        alert('⏰ Время голосования истекло!');
        return;
    }
    if (currentVotes.length !== 6) return;
    
    const btn = document.getElementById('submitVoteBtn');
    btn.textContent = 'Сохранение...'; 
    btn.disabled = true;
    
    const votesData = await fetchData(VOTES_PATH) || {};
    votesData[currentUserKey] = currentVotes;
    
    if (await sendData(VOTES_PATH, votesData)) {
        alert('✅ Голос успешно сохранен!');
        closeAllModals();
    } else {
        alert('❌ Ошибка сохранения. Попробуйте позже.');
        btn.textContent = '✅ Подтвердить выбор'; 
        btn.disabled = false;
    }
});

function goToVoting2027() {
    document.getElementById('year2025').style.display = 'none';
    document.getElementById('year2026').style.display = 'none';
    document.getElementById('year2027').style.display = 'block';
    
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes('2027')) btn.classList.add('active');
    });

    const year2027 = document.getElementById('year2027');
    const mainNoms = year2027.querySelector('.main-noms');
    const dopNoms = year2027.querySelector('.dop-noms');
    
    if (mainNoms && dopNoms) {
        mainNoms.style.display = 'none';
        dopNoms.style.display = 'block';
    }

    const switchBtns = year2027.querySelectorAll('.switch-btn');
    switchBtns.forEach(btn => btn.classList.remove('active'));
    if (switchBtns.length > 1) switchBtns[1].classList.add('active');

    const voteSection = document.getElementById('dop-vote-2027') || dopNoms;
    if (voteSection) {
        voteSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            const voteBtn = document.getElementById('openVoteBtn');
            if (voteBtn) voteBtn.click();
        }, 800);
    }
}
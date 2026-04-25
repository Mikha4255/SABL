'use strict';
(() => {
    const _k = String.fromCharCode(83,65,66,76) + "2026";
    async function _enc(txt, pwd) {
        const te = new TextEncoder();
        const keyMat = await crypto.subtle.importKey("raw", te.encode(pwd), {name:"PBKDF2"}, false, ["deriveKey"]);
        const aesKey = await crypto.subtle.deriveKey(
            {name:"PBKDF2", salt:te.encode("sabl_salt_2026"), iterations:1e5, hash:"SHA-256"},
            keyMat, {name:"AES-GCM", length:256}, false, ["encrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = await crypto.subtle.encrypt({name:"AES-GCM", iv}, aesKey, te.encode(txt));
        return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(ct)));
    }
    async function _dec(b64, pwd) {
        const bin = atob(b64);
        const iv = new Uint8Array(bin.slice(0,12).split('').map(c => c.charCodeAt(0)));
        const ct = new Uint8Array(bin.slice(12).split('').map(c => c.charCodeAt(0)));
        const te = new TextEncoder();
        const keyMat = await crypto.subtle.importKey("raw", te.encode(pwd), {name:"PBKDF2"}, false, ["deriveKey"]);
        const aesKey = await crypto.subtle.deriveKey(
            {name:"PBKDF2", salt:te.encode("sabl_salt_2026"), iterations:1e5, hash:"SHA-256"},
            keyMat, {name:"AES-GCM", length:256}, false, ["decrypt"]
        );
        const pt = await crypto.subtle.decrypt({name:"AES-GCM", iv}, aesKey, ct);
        return new TextDecoder().decode(pt);
    }
    const _x42 = (path) => String.fromCharCode(
        104,116,116,112,115,58,47,47,102,105,110,97,108,45,118,111,116,101,45,49,53,51,53,45,100,101,102,97,117,108,116,45,114,116,100,98,46,101,117,114,111,112,101,45,119,101,115,116,49,46,102,105,114,101,98,97,115,101,100,97,116,97,98,97,115,101,46,97,112,112
    ) + '/' + path;
    const _n = _x42('nominees.json');
    const _v = _x42('votes.json');
    const _s = _x42('suggestions.json');
    const _m = 2;
    const _u = 'extra_nom_user_key';
    const _c = 5 * 60 * 1000;
    const _voteStart = new Date('2026-04-13T00:00:00+03:00').getTime();
    const _voteEnd = new Date('2026-05-03T23:59:59+03:00').getTime();
    
    function _isVotingActive() {
        const now = Date.now();
        return now >= _voteStart && now <= _voteEnd;
    }
    function _getVotingStatus() {
        const now = Date.now();
        if (now < _voteStart) {
            const hoursLeft = Math.floor((_voteStart - now) / (1000 * 60 * 60));
            return { active: false, message: `Голосование начнётся через ${hoursLeft} ч.` };
        } else if (now > _voteEnd) {
            return { active: false, message: 'Голосование завершено' };
        }
        return { active: true, message: 'Голосование активно' };
    }
    let _ac = null;
    let _ct = 0;
    
    async function _lan() {
        if (_ac && (Date.now() - _ct) < _c) return _ac;
        const res = await fetch(_n);
        const data = await res.json();
        if (data && data.v) {
            const plain = await _dec(data.v, _k);
            _ac = JSON.parse(plain);
        } else {
            _ac = data || {};
        }
        _ct = Date.now();
        return _ac;
    }
    
    function _gcn(nomination) {
        const cached = sessionStorage.getItem(`nominees_${nomination}`);
        const timestamp = sessionStorage.getItem(`nominees_time_${nomination}`);
        if (cached && timestamp && (Date.now() - parseInt(timestamp)) < _c) {
            return JSON.parse(cached);
        }
        return null;
    }
    
    function _cn(nomination, data) {
        sessionStorage.setItem(`nominees_${nomination}`, JSON.stringify(data));
        sessionStorage.setItem(`nominees_time_${nomination}`, Date.now().toString());
    }
    
    async function _ln(nomination) {
        const cached = _gcn(nomination);
        if (cached) return cached;
        try {
            const allNominees = await _lan();
            const nominees = [];
            for (const key in allNominees) {
                if (allNominees[key].nomination === nomination) {
                    nominees.push({
                        id: key,
                        name: allNominees[key].name,
                        photo: allNominees[key].photo || 'вспомогательные_объекты/NONE.png',
                        class: allNominees[key].class || ''
                    });
                }
            }
            _cn(nomination, nominees);
            return nominees;
        } catch (e) {
            console.error('Ошибка загрузки номинантов:', e);
            return [];
        }
    }
    async function _lvf(userKey) {
        try {
            const res = await fetch(_v);
            if (res.ok) {
                const data = await res.json();
                if (data && data.v) {
                    const plain = await _dec(data.v, _k);
                    const allVotes = JSON.parse(plain);
                    if (allVotes[userKey]) {
                        return allVotes[userKey].votes || allVotes[userKey];
                    }
                } else if (data && data[userKey]) {
                    return data[userKey].votes || data[userKey];
                }
            }
            return {};
        } catch (e) {
            console.error('Ошибка загрузки голосов:', e);
            return {};
        }
    }
    async function _svf(userKey, votes) {
        try {
            let allVotes = {};
            const res = await fetch(_v);
            if (res.ok) {
                const data = await res.json();
                if (data && data.v) {
                    const plain = await _dec(data.v, _k);
                    allVotes = JSON.parse(plain);
                } else if (data) {
                    allVotes = data;
                }
            }
            if (!allVotes[userKey]) {
                allVotes[userKey] = { votes: {}, timestamp: new Date().toISOString() };
            }
            if (!allVotes[userKey].votes) {
                const oldVotes = {};
                for (const key in allVotes[userKey]) {
                    if (key !== 'timestamp') oldVotes[key] = allVotes[userKey][key];
                }
                allVotes[userKey] = { votes: oldVotes, timestamp: allVotes[userKey].timestamp || new Date().toISOString() };
            }
            allVotes[userKey].votes = votes;
            allVotes[userKey].timestamp = new Date().toISOString();
            const plain = JSON.stringify(allVotes);
            const encrypted = await _enc(plain, _k);
            await fetch(_v, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ v: encrypted })
            });
            return true;
        } catch (e) {
            console.error('Ошибка сохранения голосов:', e);
            return false;
        }
    }
    
    function _gcs(nomination) {
        return JSON.parse(sessionStorage.getItem(`votes_${nomination}`) || '[]');
    }
    
    function _scs(nomination, votes) {
        sessionStorage.setItem(`votes_${nomination}`, JSON.stringify(votes));
    }
    
    function _ucb(card, nomination) {
        const btn = card?.querySelector('.choose-nominee-btn');
        if (!btn) return;
        const selected = _gcs(nomination);
        if (selected.length === 0) {
            btn.textContent = 'Выбрать номинанта';
            btn.classList.remove('selected', 'partial');
        } else if (selected.length === 1) {
            btn.textContent = 'Выбран 1 из 2';
            btn.classList.add('partial');
            btn.classList.remove('selected');
        } else {
            btn.textContent = 'Выбрано 2 из 2';
            btn.classList.add('selected');
            btn.classList.remove('partial');
        }
    }
    function _uacb() {
        document.querySelectorAll('.choose-nominee-btn').forEach(btn => {
            const card = btn.closest('.nomcard');
            if (!card) return;
            const onclick = btn.getAttribute('onclick') || '';
            const match = onclick.match(/'([^']+)'/);
            const nomination = match ? match[1] : null;
            if (nomination) {
                _ucb(card, nomination);
            }
        });
    }
    async function _luv() {
        const userKey = sessionStorage.getItem(_u);
        if (!userKey) return;
        const firebaseVotes = await _lvf(userKey);
        for (const nomination in firebaseVotes) {
            const votes = Array.isArray(firebaseVotes[nomination]) ? firebaseVotes[nomination] : [firebaseVotes[nomination]];
            _scs(nomination, votes);
        }
        _uacb();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(_uacb, 100);
            setTimeout(_luv, 200);
        });
    } else {
        setTimeout(_uacb, 100);
        setTimeout(_luv, 200);
    }
    async function _onm(nomination, card) {
        const status = _getVotingStatus();
        if (!status.active) {
            alert(`⏰ ${status.message}`);
            return;
        }
        
        if (!sessionStorage.getItem(_u)) {
            alert('Сначала представьтесь!');
            const fioModal = document.getElementById('fioModal');
            if (fioModal) fioModal.classList.add('active');
            return;
        }
        
        const modal = document.getElementById('nomineeModal');
        const title = document.getElementById('nomineeModalTitle');
        const list = document.getElementById('nomineesList');
        const loading = document.getElementById('nomineeLoading');
        const counter = document.getElementById('selectionCounter');
        const suggestBtn = document.getElementById('suggestNomineeBtn');
        
        if (!modal || !title || !list) return;
        
        window.currentNomination = nomination;
        window.currentCard = card;
        title.textContent = nomination;
        counter.textContent = `Выбрано: 0/${_m}`;
        list.innerHTML = '';
        loading.classList.add('active');
        modal.classList.add('active');
        
        if (suggestBtn) {
            suggestBtn.onclick = () => _osm(nomination, card);
        }
        
        const nominees = await _ln(nomination);
        const currentSelections = _gcs(nomination);
        const suggestedNominees = [];
        
        currentSelections.forEach(selectedId => {
            if (selectedId.startsWith('sugg_')) {
                suggestedNominees.push({
                    id: selectedId,
                    name: 'Предложенный номинант',
                    photo: 'вспомогательные_объекты/NONE.png',
                    class: '',
                    isSuggested: true
                });
            }
        });
        
        loading.classList.remove('active');
        const allNomineesToDisplay = [...nominees, ...suggestedNominees];
        
        if (allNomineesToDisplay.length === 0) {
            list.innerHTML = '<p style="color:#ff6f00;text-align:center;">Номинанты ещё не добавлены</p>';
            return;
        }
        
        allNomineesToDisplay.forEach(nominee => {
            const isSelected = currentSelections.includes(nominee.id);
            const cardEl = document.createElement('div');
            cardEl.className = 'nominee-card' + (isSelected ? ' selected' : '');
            
            if (window.currentNomination === 'Фейл года') {
                cardEl.classList.add('fail-year');
            } else if (window.currentNomination === 'Событие года') {
                cardEl.classList.add('event-year');
            }
            
            if (nominee.isSuggested) {
                cardEl.style.border = '2px dashed #3498db';
                cardEl.innerHTML = `
                    <img src="${nominee.photo}" alt="${nominee.name}" class="nominee-photo" loading="lazy">
                    <div class="nominee-name">${nominee.name} 💡</div>
                    <div class="nominee-class">Ваше предложение</div>
                `;
            } else {
                cardEl.innerHTML = `
                    <img src="${nominee.photo}" alt="${nominee.name}" class="nominee-photo" loading="lazy">
                    <div class="nominee-name">${nominee.name}</div>
                    <div class="nominee-class">${nominee.class}</div>
                `;
            }
            
            cardEl.onclick = (e) => {
                e.stopPropagation();
                _tns(nomination, nominee.id, cardEl);
                _usc(nomination);
                if (card) _ucb(card, nomination);
            };
            list.appendChild(cardEl);
        });
        
        _usc(nomination);
        if (card) _ucb(card, nomination);
    }
    function _tns(nomination, nomineeId, cardEl) {
        let selected = _gcs(nomination);
        if (selected.includes(nomineeId)) {
            selected = selected.filter(id => id !== nomineeId);
            cardEl.classList.remove('selected');
        } else if (selected.length < _m) {
            selected.push(nomineeId);
            cardEl.classList.add('selected');
        } else {
            alert(`Можно выбрать не более ${_m} номинантов`);
            return;
        }
        _scs(nomination, selected);
    }
    function _usc(nomination) {
        const count = _gcs(nomination).length;
        const el = document.getElementById('selectionCounter');
        if (el) el.textContent = `Выбрано: ${count}/${_m}`;
    }
    async function _sv(nomination) {
        const status = _getVotingStatus();
        if (!status.active) {
            alert(`⏰ ${status.message}`);
            return;
        }
        const votes = _gcs(nomination);
        if (votes.length === 0) {
            alert('Выберите хотя бы одного номинанта');
            return;
        }
        const userKey = sessionStorage.getItem(_u);
        if (!userKey) {
            alert('Ошибка: данные пользователя не найдены');
            return;
        }
        let allUserVotes = await _lvf(userKey);
        allUserVotes[nomination] = votes;
        const saved = await _svf(userKey, allUserVotes);
        
        if (saved) {
            alert('Голос сохранён! ✅');
            _cnm();
        } else {
            alert('Ошибка при отправке голоса ❌');
        }
    }
    
    async function _osm(nomination, card) {
        const status = _getVotingStatus();
        if (!status.active) {
            alert(`⏰ ${status.message}`);
            return;
        }
        
        const name = prompt(`Предложить номинанта для "${nomination}":\nВведите ФИО:`);
        if (!name || name.trim().length < 2) return;
        const userKey = sessionStorage.getItem(_u) || 'anonymous';
        const suggestion = {
            nomination,
            name: name.trim(),
            suggestedBy: userKey,
            timestamp: new Date().toISOString(),
            isCustom: true
        };
        try {
            let allSuggestions = {};
            const res = await fetch(_s);
            if (res.ok) {
                const data = await res.json();
                if (data && data.v) {
                    const plain = await _dec(data.v, _k);
                    allSuggestions = JSON.parse(plain);
                } else if (data) {
                    allSuggestions = data;
                }
            }
            const newKey = 'sugg_' + Date.now();
            allSuggestions[newKey] = suggestion;
            const plain = JSON.stringify(allSuggestions);
            const encrypted = await _enc(plain, _k);
            await fetch(_s, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ v: encrypted })
            });
            let selected = _gcs(nomination);
            if (selected.length < _m) {
                selected.push(newKey);
                _scs(nomination, selected);
                _usc(nomination);
                if (card) _ucb(card, nomination);
                alert('Номинант предложен и добавлен в ваш выбор! ✅');
                _onm(nomination, card);
            } else {
                alert('Номинант предложен! Но у вас уже выбрано 2 кандидата.');
            }
        } catch (e) {
            alert('Ошибка отправки ❌');
            console.error(e);
        }
    }
    
    function _cnm() {
        const modal = document.getElementById('nomineeModal');
        if (modal) modal.classList.remove('active');
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') _cnm();
    });
    
    // === ЭКСПОРТ ===
    window.openNomineeModal = _onm;
    window.closeNomineeModal = _cnm;
    window.submitVote = _sv;
})();
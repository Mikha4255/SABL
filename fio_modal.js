'use strict';
(() => {
    const fioModal = document.getElementById('fioModal');
    const fioConfirm = document.getElementById('fioConfirm');
    const fioClose = document.getElementById('fioClose');
    const fioError = document.getElementById('fioError');
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const userClassInput = document.getElementById('userClass');
    
    const SESSION_USER_KEY = 'extra_nom_user_key';
    
    function validateName(name) {
        const trimmed = name.trim();
        if (trimmed.length < 2) return false;
        return /^[а-яёА-ЯЁ\-']+$/u.test(trimmed);
    }
    
    function validateClass(cls) {
        const trimmed = cls.trim().toUpperCase();
        return /^([1-9]|1[01])[А-ЯЁ]$/u.test(trimmed);
    }
    
    function closeFioModal() {
        if (fioModal) fioModal.classList.remove('active');
        if (fioError) fioError.textContent = '';
    }
    async function loadUserVotes(userKey) {
        const _k = String.fromCharCode(83,65,66,76) + "2026";
        
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
        
        try {
            const res = await fetch(_x42('votes.json'));
            if (res.ok) {
                const data = await res.json();
                if (data && data.v) {
                    const plain = await _dec(data.v, _k);
                    const allVotes = JSON.parse(plain);
                    if (allVotes[userKey]) {
                        const userVotes = allVotes[userKey].votes || allVotes[userKey];
                        // Синхронизируем sessionStorage
                        for (const nomination in userVotes) {
                            const votes = Array.isArray(userVotes[nomination]) ? userVotes[nomination] : [userVotes[nomination]];
                            sessionStorage.setItem(`votes_${nomination}`, JSON.stringify(votes));
                        }
                        return true;
                    }
                }
            }
        } catch (e) {
            console.error('Ошибка загрузки голосов:', e);
        }
        return false;
    }
    
    fioConfirm?.addEventListener('click', async () => {
        const last = lastNameInput?.value || '';
        const first = firstNameInput?.value || '';
        const cls = userClassInput?.value || '';
        
        if (fioError) fioError.textContent = '';
        
        if (!validateName(last)) {
            if (fioError) fioError.textContent = '❌ Фамилия: только буквы, минимум 2 символа';
            return;
        }
        if (!validateName(first)) {
            if (fioError) fioError.textContent = '❌ Имя: только буквы, минимум 2 символа';
            return;
        }
        if (!validateClass(cls)) {
            if (fioError) fioError.textContent = '❌ Класс: формат 5А, 10Б, 11В';
            return;
        }
        
        const fio = `${last.trim()} ${first.trim()}`;
        const normalizedClass = cls.trim().toUpperCase();
        const userKey = `${fio}|${normalizedClass}`;
        sessionStorage.setItem(SESSION_USER_KEY, userKey);
        await loadUserVotes(userKey);
        closeFioModal();
        alert(`✅ Привет, ${fio}! Теперь ты можешь голосовать.`);
        if (window.openNomineeModal) {
            document.querySelectorAll('.choose-nominee-btn').forEach(btn => {
                const card = btn.closest('.nomcard');
                if (card) {
                    const onclick = btn.getAttribute('onclick') || '';
                    const match = onclick.match(/'([^']+)'/);
                    const nomination = match ? match[1] : null;
                    if (nomination) {
                        const selected = JSON.parse(sessionStorage.getItem(`votes_${nomination}`) || '[]');
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
                }
            });
        }
    });
    
    fioClose?.addEventListener('click', closeFioModal);
    
    fioModal?.addEventListener('click', (e) => {
        if (e.target === fioModal) closeFioModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fioModal?.classList.contains('active')) {
            closeFioModal();
        }
    });
    
    [lastNameInput, firstNameInput, userClassInput].forEach(input => {
        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') fioConfirm?.click();
        });
    });
    
    window.openFioModal = function() {
        if (fioModal) {
            fioModal.classList.add('active');
            if (fioError) fioError.textContent = '';
            if (lastNameInput) lastNameInput.focus();
        }
    };
})();
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
    
    fioConfirm?.addEventListener('click', () => {
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
        closeFioModal();
        alert(`✅ Привет, ${fio}! Теперь ты можешь голосовать.`);
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
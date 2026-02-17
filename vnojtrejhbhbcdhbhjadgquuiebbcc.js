'use strict'

(() => {
    const x1 = String.fromCharCode(83,65,66,76) + "2026";
    
    async function f8(t1, p2) {
        const e3 = new TextEncoder();
        const k4 = await crypto.subtle.importKey("raw", e3.encode(p2), {name:"PBKDF2"}, !1, ["deriveKey"]);
        const d5 = await crypto.subtle.deriveKey(
            {name:"PBKDF2", salt:e3.encode("sabl_salt_2026"), iterations:1e5, hash:"SHA-256"}, k4,{name:"AES-GCM", length:256},!1,["encrypt"]
        );
        const i6 = crypto.getRandomValues(new Uint8Array(12));
        const c7 = await crypto.subtle.encrypt({name:"AES-GCM", iv:i6}, d5, e3.encode(t1));
        return btoa(String.fromCharCode(...i6) + String.fromCharCode(...new Uint8Array(c7)));
    }
    async function d3(b8, p2) {
        const r9 = atob(b8);
        const i6 = new Uint8Array(r9.slice(0,12).split('').map(c => c.charCodeAt(0)));
        const c7 = new Uint8Array(r9.slice(12).split('').map(c => c.charCodeAt(0)));
        const e3 = new TextEncoder();
        const k4 = await crypto.subtle.importKey("raw", e3.encode(p2), {name:"PBKDF2"}, !1, ["deriveKey"]);
        const d5 = await crypto.subtle.deriveKey(
            {name:"PBKDF2", salt:e3.encode("sabl_salt_2026"), iterations:1e5, hash:"SHA-256"},k4,{name:"AES-GCM", length:256},!1,["decrypt"]
        );
        const t1 = await crypto.subtle.decrypt({name:"AES-GCM", iv:i6}, d5, c7);
        return new TextDecoder().decode(t1);
    }
    const u9 = () => String.fromCharCode(104,116,116,112,115,58,47,47,115,99,104,111,111,108,45,118,111,116,101,45,52,50,45,100,101,102,97,117,108,116,45,114,116,100,98,46,101,117,114,111,112,101,45,119,101,115,116,49,46,102,105,114,101,98,97,115,101,100,97,116,97,98,97,115,101,46,97,112,112,47,118,111,116,101,115,46,106,115,111,110);
    const s0 = new Date('2026-02-23T00:00:00+03:00');
    const e1 = new Date('2026-03-08T23:59:59+03:00');
    const n2 = new Date();
    function z3() {
        const b4 = document.getElementById('extra_nom_vote');
        if (!b4) return;
        const c5 = new Date();
        if (c5 < s0) {
            b4.textContent = 'Здесь ты проголосуешь';
            b4.style.pointerEvents = 'none';
            b4.style.opacity = '0.5';
            b4.style.cursor = 'not-allowed';
        } else if (c5 <= e1) {
            b4.textContent = 'Выбери 6 дополнительных номинаций премии';
            b4.style.pointerEvents = '';
            b4.style.opacity = '';
            b4.style.cursor = '';
        } else {
            b4.textContent = 'Голосование завершено';
            b4.style.pointerEvents = 'none';
            b4.style.opacity = '0.5';
            b4.style.cursor = 'not-allowed';
        }
    }
    z3();
    if (n2 < s0) {
        const t6 = s0.getTime() - n2.getTime();
        setTimeout(z3, t6);
    }
    
    const k7 = 'extra_nom_user_key';
    const i8 = 'extra_nom_in_progress';
    const v9 = document.getElementById('extra_nom_vote');
    const m0 = document.getElementById('fioModal');
    const c1 = document.getElementById('fioConfirm');
    const l2 = document.getElementById('fioClose');
    const r3 = document.getElementById('fioError');
    const m4 = document.querySelector('.modal3');
    const o5 = document.querySelector('.modal-overlay3');
    const x6 = document.querySelector('.close-modal3');
    const n7 = document.querySelectorAll('.nomination');
    const t8 = document.getElementById('counter');
    const y9 = document.getElementById('confirmVote');
    let u0 = null;
    let s1 = 0;
    const M2 = 6;
    
    function V3(n4) {
        const t5 = n4.trim();
        if (t5.length < 2) return !1;
        return /^[а-яёА-ЯЁ\-']+$/u.test(t5);
    }
    function C4(c5) {
        const t5 = c5.trim().toUpperCase();
        return /^([1-9]|1[01])[А-ЯЁ]$/u.test(t5);
    }
    function E5(m6) {
        r3.textContent = m6;
    }
    function R6() {
        r3.textContent = '';
    }
    function D7() {
        v9.textContent = 'Голос учтён';
        v9.style.pointerEvents = 'none';
        v9.style.opacity = '0.6';
    }
    function O8() {
        document.body.style.overflow = 'hidden';
        const s9 = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${s9}px`;
        document.body.style.width = '100%';
        m4.classList.add('active');
        setTimeout(() => m4.classList.add('visible'), 200);
    }
    function P9() {
        m4.classList.remove('visible');
        setTimeout(() => {
            m4.classList.remove('active');
            const s9 = parseInt(document.body.style.top || '0') * -1;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, s9);
        }, 300);
    }
    o5.addEventListener('click', P9);
    x6.addEventListener('click', P9);
    
    async function G0() {
        try {
            const r1 = await fetch(u9());
            if (!r1.ok) return {};
            const j2 = await r1.json();
            if (j2 === null) return {};
            if (typeof j2.v === "string") {
                const w3 = await d3(j2.v, x1);
                return JSON.parse(w3);
            }
            return j2;
        } catch {
            return {};
        }
    }
    async function H1(q2) {
        try {
            const w3 = JSON.stringify(q2);
            const e4 = await f8(w3, x1);
            const r1 = await fetch(u9(), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ v: e4 })
            });
            return r1.ok;
        } catch {
            return !1;
        }
    }
    
    const B2 = sessionStorage.getItem(k7);
    if (B2) {
        sessionStorage.setItem(i8, 'true');
        G0().then(q2 => {
            if (q2[B2]) {
                D7();
                sessionStorage.removeItem(k7);
                sessionStorage.removeItem(i8);
            } else {
                u0 = B2;
            }
        });
    }
    
    v9?.addEventListener('click', () => {
        const n4 = new Date();
        if (n4 < s0 || n4 > e1) {
            alert('Голосование сейчас недоступно');
            return;
        }
        if (u0) {
            O8();
            return;
        }
        m0.classList.add('active');
        R6();
    });
    
    c1?.addEventListener('click', () => {
        const a5 = document.getElementById('lastName').value;
        const b6 = document.getElementById('firstName').value;
        const c7 = document.getElementById('userClass').value;
        R6();
        if (!V3(a5)) {
            E5('Фамилия должна содержать только буквы и быть не короче 2 символов');
            return;
        }
        if (!V3(b6)) {
            E5('Имя должно содержать только буквы и быть не короче 2 символов');
            return;
        }
        if (!C4(c7)) {
            E5('Класс должен быть в формате: 5А, 10Б, 11В (цифры + одна заглавная буква)');
            return;
        }
        const d8 = `${a5.trim()} ${b6.trim()}`;
        const e9 = c7.trim().toUpperCase();
        u0 = `${d8}|${e9}`;
        sessionStorage.setItem(k7, u0);
        sessionStorage.setItem(i8, 'true');
        G0().then(q2 => {
            if (q2[u0]) {
                alert('Вы уже голосовали!');
                m0.classList.remove('active');
                D7();
            } else {
                m0.classList.remove('active');
                O8();
            }
        });
    });
    
    l2?.addEventListener('click', () => {
        m0.classList.remove('active');
    });
    
    function F0() {
        t8.textContent = `Осталось выбрать: ${M2 - s1}`;
    }
    F0();
    
    n7.forEach(n4 => {
        const b6 = n4.querySelector('.choose-btn');
        b6.addEventListener('click', () => {
            if (n4.classList.contains('selected')) {
                n4.classList.remove('selected');
                b6.textContent = 'Выбрать';
                s1--;
            } else if (s1 < M2) {
                n4.classList.add('selected');
                b6.textContent = 'Убрать';
                s1++;
            }
            F0();
        });
    });
    
    y9?.addEventListener('click', () => {
        const n4 = new Date();
        if (n4 < s0 || n4 > e1) {
            alert('Голосование завершено');
            return;
        }
        if (!u0) {
            alert('Ошибка: данные пользователя не найдены');
            return;
        }
        if (s1 !== M2) {
            alert(`Нужно выбрать ровно ${M2} номинаций`);
            return;
        }
        const g1 = [];
        document.querySelectorAll('.nomination.selected')
            .forEach(n4 => g1.push(n4.dataset.nomination));
        G0().then(q2 => {
            q2[u0] = g1;
            H1(q2).then(ok => {
                if (ok) {
                    alert('Голос успешно сохранён!');
                    P9();
                    sessionStorage.removeItem(k7);
                    sessionStorage.removeItem(i8);
                    D7();
                } else {
                    alert('Ошибка при отправке голоса');
                }
            });
        });
    });
    
    const m5 = document.querySelector('.modal2');
    const x7 = document.querySelector('.close-modal2');
    const t9 = document.querySelector('.modal2-title');
    const y0 = document.querySelector('.modal2-text');
    const u1 = document.querySelector('.modal2-img');
    function I2(t3, x4, u5) { 
        t9.textContent = t3;
        y0.textContent = x4;
        u1.src = u5;
        m5.classList.add('active');
        setTimeout(() => m5.classList.add('visible'), 200);
    }
    function J3() {
        m5.classList.remove('visible');
        setTimeout(() => m5.classList.remove('active'), 300);
    }
    document.querySelector('.close-modal2')?.addEventListener('click', J3);
    document.querySelector('.modal-overlay2')?.addEventListener('click', J3);
    document.querySelectorAll('.nomination .extra-info').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const c7 = img.closest('.nomination');
            const t3 = c7.dataset.title;
            const x4 = c7.dataset.text;
            const u5 = c7.dataset.img;
            I2(t3, x4, u5);
        });
    });
})();
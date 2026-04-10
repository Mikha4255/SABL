'use strict';

function getHypeIndex() {
    return Math.floor(Math.random() * 100) + 1;
}

function getTwoHourWindow() {
    const now = new Date();
    const hours = now.getHours();
    const windowStart = Math.floor(hours / 2) * 2;
    return `${now.toDateString()}_${windowStart}`;
}

function renderHype(index) {
    const box = document.getElementById('hypeIndexBox');
    if (!box) return;

    const loader = box.querySelector('.hype-loader');
    if (loader) loader.style.display = 'none';

    const resultEl = document.createElement('div');
    resultEl.className = 'hype-result';
    if (index >= 42 && index !== 67) {
        resultEl.innerHTML = `<p>🔥 Индекс хайпа на сегодня: ${index} <br> ✅ А ты на хайпе братуха</p>`;
    } else {
        resultEl.innerHTML = `<p>⚠️ Индекс хайпа на сегодня: ${index} <br> ❌ Ну маловато братуха</p>`;
    }
    box.appendChild(resultEl);
}

function startLoadingAnimation() {
    const box = document.getElementById('hypeIndexBox');
    if (!box) return;
    box.innerHTML = '';
    const loader = document.createElement('div');
    loader.className = 'hype-loader';
    loader.innerHTML = `
        <p>Генерация хайпа<span id="hype-dots"></span></p>
        <style>
            .hype-loader {
                text-align: center;
                font-size: 42px;
                color: #ff4800;
            }
            #hype-dots::after {
                content: '';
                animation: hypeDots 1.4s steps(5, end) infinite;
            }
            @keyframes hypeDots {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60%, 100% { content: '...'; }
            }
        </style>
    `;
    box.appendChild(loader);
}

function updateHypeIndex() {
    const currentWindow = getTwoHourWindow();
    const storedData = localStorage.getItem('hypeData');

    let indexToUse;

    if (storedData) {
        const { window, index } = JSON.parse(storedData);
        if (window === currentWindow) {
            indexToUse = index;
        } else {
            indexToUse = getHypeIndex();
            localStorage.setItem('hypeData', JSON.stringify({ window: currentWindow, index: indexToUse }));
        }
    } else {
        indexToUse = getHypeIndex();
        localStorage.setItem('hypeData', JSON.stringify({ window: currentWindow, index: indexToUse }));
    }

    renderHype(indexToUse);
}

function scheduleNextUpdate() {
    const now = new Date();
    const nextUpdate = new Date(now);
    // Переходим к началу следующего 2-часового окна
    const currentHour = now.getHours();
    const nextWindowStart = (Math.floor(currentHour / 2) + 1) * 2;
    nextUpdate.setHours(nextWindowStart, 0, 0, 0);

    const delay = nextUpdate.getTime() - now.getTime();

    setTimeout(() => {
        startLoadingAnimation();
        setTimeout(updateHypeIndex, 2000);
        scheduleNextUpdate();
    }, delay);
}
startLoadingAnimation();
setTimeout(updateHypeIndex, 5000);
scheduleNextUpdate();
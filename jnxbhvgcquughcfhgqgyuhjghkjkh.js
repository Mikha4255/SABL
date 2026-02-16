function getHypeIndex() {
    return Math.floor(Math.random() * 100) + 1;
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
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('hypeData');
    let indexToUse;
    if (storedData) {
        const { date, index } = JSON.parse(storedData);
        if (date === today) {
            indexToUse = index;
        } else {
            indexToUse = getHypeIndex();
            localStorage.setItem('hypeData', JSON.stringify({ date: today, index: indexToUse }));
        }
    } else {
        indexToUse = getHypeIndex();
        localStorage.setItem('hypeData', JSON.stringify({ date: today, index: indexToUse }));
    }
    renderHype(indexToUse);
}
function setMidnightReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    setTimeout(() => {
        startLoadingAnimation();
        setTimeout(() => {
            updateHypeIndex();
        }, 2000);
        setMidnightReset();
    }, msUntilMidnight);
}
startLoadingAnimation();
setTimeout(updateHypeIndex, 5000);
setMidnightReset();
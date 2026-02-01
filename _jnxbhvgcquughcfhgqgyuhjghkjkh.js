function getHypeIndex() {
    return Math.floor(Math.random() * 100) + 1;
}

function updateHypeIndex() {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('hypeData');
    if (storedData) {
        const { date, index } = JSON.parse(storedData);
        if (date === today) {
            if(index >= 42){
                document.getElementById('hypeIndexBox').innerHTML = 
                   `<p>🔥 Индекс хайпа на сегодня: ${index} <br> ✅ А ты на хайпе братуха</p>`;
            } else{
                document.getElementById('hypeIndexBox').innerHTML = 
                    `<p>⚠️ Индекс хайпа на сегодня: ${index} <br> ❌ Ну маловато братуха</p>`;
            }
            return; 
        }
    }
    const newIndex = getHypeIndex();
    const newData = {
        date: today,
        index: newIndex
    };
    
    localStorage.setItem('hypeData', JSON.stringify(newData));
    if(index >= 42){
        document.getElementById('hypeIndexBox').innerHTML = 
        `<p>🔥 Индекс хайпа на сегодня: ${newIndex} <br> ✅ А ты на хайпе братуха</p>`;
    } else{
        document.getElementById('hypeIndexBox').innerHTML = 
        `<p>⚠️ Индекс хайпа на сегодня: ${newIndex} <br> ❌ Ну маловато братуха</p>`;
    }
}

function setMidnightReset() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow - now;
    setTimeout(() => {
        updateHypeIndex();
        setMidnightReset();
    }, msUntilMidnight);
}

updateHypeIndex();
setMidnightReset();
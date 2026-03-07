'use strict';

const stages = [
    {
        name: "Сидим не рыпаемся",
        start: new Date('2025-06-26T00:00:00+03:00').getTime(),
        end: new Date('2025-10-11T23:59:59+03:00').getTime(),
        message: "До начала этапа «Прогрев» осталось:",
        activeMessage: "Этап «Сидим не рыпаемся» идёт",
        endedMessage: "Этап «Сидим не рыпаемся» завершён"
    },
    {
        name: "Прогрев",
        start: new Date('2025-10-11T00:00:00+03:00').getTime(),
        end: new Date('2026-02-23T00:00:00+03:00').getTime(),
        message: "До начала голосования за доп. номинации осталось:",
        activeMessage: "Этап «Прогрев» идёт",
        endedMessage: "Этап «Прогрев» завершён"
    },
    {
        name: "Голосования за доп. номинации",
        start: new Date('2026-02-23T00:00:00+03:00').getTime(),
        end: new Date('2026-03-08T23:59:59+03:00').getTime(),
        message: "До окончания голосования осталось:",
        activeMessage: "🔥 Голосование идёт!",
        endedMessage: "Голосование за доп. номинации завершено"
    },
    {
        name: "Отбор номинантов",
        start: new Date('2026-03-23T00:00:00+03:00').getTime(),
        end: new Date('2026-04-05T23:59:59+03:00').getTime(),
        message: "До начала отбора номинантов осталось:",
        activeMessage: "Этап «Отбор номинантов» идёт",
        endedMessage: "Отбор номинантов завершён"
    },
    {
        name: "Голосования за победителей",
        start: new Date('2026-04-13T00:00:00+03:00').getTime(),
        end: new Date('2026-04-30T23:59:59+03:00').getTime(),
        message: "До начала голосования за победителей осталось:",
        activeMessage: "🔥 Голосование за победителей идёт!",
        endedMessage: "Голосование за победителей завершено"
    },
    {
        name: "Онлайн премия",
        start: new Date('2026-05-15T00:00:00+03:00').getTime(),
        end: new Date('2026-05-25T23:59:59+03:00').getTime(),
        message: "До начала онлайн-премии осталось:",
        activeMessage: "🎉 Онлайн-премия идёт!",
        endedMessage: "Онлайн-премия завершена"
    },
    {
        name: "Награждение",
        start: new Date('2026-05-30T00:00:00+03:00').getTime(),
        end: new Date('2026-05-31T23:59:59+03:00').getTime(),
        message: "До начала награждения осталось:",
        activeMessage: "🏆 Награждение идёт!",
        endedMessage: "Премия SABL2026 завершена! 🎉"
    }
];

function getCurrentStage() {
    const now = new Date().getTime();
    
    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        if (now >= stage.start && now <= stage.end) {
            return { stage: stage, index: i, status: 'active' };
        }
        if (now < stage.start) {
            if (i > 0) {
                const prevStage = stages[i - 1];
                if (now > prevStage.end) {
                    return { 
                        stage: stage, 
                        index: i, 
                        status: 'interstage',
                        prevStageName: prevStage.name
                    };
                }
            }
            return { stage: stage, index: i, status: 'upcoming' };
        }
    }
    return { stage: stages[stages.length - 1], index: stages.length - 1, status: 'ended' };
}

function updateTimer() {
    const now = new Date().getTime();
    const current = getCurrentStage();
    
    const messageEl = document.getElementById('timer-message');
    const countdownEl = document.getElementById('timer-countdown');
    const warningEl = document.getElementById('opi');
    
    if (!messageEl || !countdownEl) return;
    
    let targetTime;
    let messageText;
    
    if (current.status === 'active') {
        targetTime = current.stage.end;
        messageText = current.stage.activeMessage;
        messageEl.classList.remove('interstage');
        
    } else if (current.status === 'interstage') {
        targetTime = current.stage.start;
        messageText = `⏳ Межэтапье: до начала «${current.stage.name}» осталось:`;
        messageEl.classList.add('interstage');
        
    } else if (current.status === 'upcoming') {
        targetTime = current.stage.start;
        messageText = current.stage.message;
        messageEl.classList.remove('interstage');
        
    } else {
        messageEl.textContent = '🏆 Премия SABL2026 завершена!';
        messageEl.style.color = '#ff6600';
        countdownEl.textContent = '';
        if (warningEl) warningEl.style.display = 'none';
        return;
    }
    
    const timeLeft = targetTime - now;
    if (timeLeft <= 0) {
        if (current.status === 'active') {
            messageEl.textContent = current.stage.endedMessage;
            messageEl.style.color = '#4CAF50';
        } else {
            messageEl.textContent = current.stage.activeMessage;
            messageEl.style.color = '#ff6600';
        }
        countdownEl.textContent = '';
        updateWarning();
        return;
    }
    messageEl.style.color = '';
    messageEl.textContent = messageText;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    countdownEl.textContent = 
        days + ' дней ' + 
        hours + ' часов ' + 
        minutes + ' минут ' +  
        seconds + ' секунд';
    
    updateWarning();
}

function updateWarning() {
    const warningEl = document.getElementById('opi');
    if (!warningEl) return;
    
    if (window.innerWidth <= 700) {
        warningEl.innerHTML = '<span style="color:#ff0000">⚠️ Лучше используйте компьютерную версию сайта!!!</span>';
        warningEl.style.display = 'block';
        warningEl.style.fontSize = '28px';
        warningEl.style.textAlign = 'center';
        warningEl.style.margin = '10px 0';
    } else {
        warningEl.style.display = 'none';
    }
}

setInterval(updateTimer, 1000);
updateTimer();
updateWarning();
window.addEventListener('resize', updateWarning);

function showYear(event, year) {
    document.getElementById('year2025').style.display = 'none';
    document.getElementById('year2026').style.display = 'none';
    document.getElementById('year' + year).style.display = 'block';
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.archive-btn').classList.add('active');
});
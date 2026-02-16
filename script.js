'use strict'

function updateTimer() {
    const targetDate = new Date('2026-02-8T00:00:00').getTime();
    const endDate = new Date('2026-03-08T23:59:59').getTime();
    const message = document.getElementById('opi');
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft < 0) {
        message.innerHTML = 'Голосование идёт';
        document.getElementById('timer').innerHTML = 'NONE';
        return;
    }
    if(now > endDate){
        message.innerHTML = 'Голосование прошло';
        document.getElementById('timer').innerHTML = 'NONE';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    if(timeLeft > 0){
    document.getElementById('timer').innerHTML = 
        days + ' дней ' + 
        hours + ' часов ' + 
        minutes + ' минут ' +  
        seconds + ' секунд';
    }
}

setInterval(updateTimer, 1000);
updateTimer();


function updateMessage() {
    const message = document.getElementById('opi');
    message.style.display = 'block';
    if (window.innerWidth > 700) {
        message.innerHTML = 'До голосования за дополнительные номинации осталось:';
        document.getElementById('timer').style.display = 'block';
    } else {
        message.innerHTML = `<span style="color:#ff0000">Лучше используйте компьютерную версию сайта!!!</span><br>
        До голосования за дополнительные номинации осталось:`;
        message.style.fontSize = '32px';
        document.getElementById('timer').style.display = 'block';
    }
}

updateMessage();

window.addEventListener('resize', updateMessage);

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

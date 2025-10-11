//function updateTimer() {
//     const targetDate = new Date('2026-06-17T00:00:00').getTime();
//     const now = new Date().getTime();
//     const timeLeft = targetDate - now;

//     if (timeLeft < 0) {
//         document.getElementById('timer').innerHTML = 'Время пришло!';
//         return;
//     }

//     const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

//     document.getElementById('timer').innerHTML = 
//         days + ' дней ' + 
//         hours + ' часов ' + 
//         minutes + ' минут ' + 
//         seconds + ' секунд';
//}

//setInterval(updateTimer, 1000);
//updateTimer();

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
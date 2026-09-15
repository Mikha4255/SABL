'use strict';

function whatYear(){
    let years = document.querySelectorAll('[id^="year"]');
    let activeYear = null;
    for (let year of years) {
        if (year.style.display !== 'none') {
            activeYear = year;
            break;
        }
    }
    return activeYear;
}

function showYear(event, year){
    document.getElementById('year2025').style.display = 'none';
    document.getElementById('year2026').style.display = 'none';
    document.getElementById('year2027').style.display = 'none';
    document.getElementById('year' + year).style.display = 'block';
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    showNom(event, 'main');
    let activeYear = whatYear();
    if (!activeYear){ 
        return;
    }
    let btns = activeYear.querySelectorAll('.switch-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    btns[0].classList.add('active');
}

function showNom(event, category) {
    let activeYear = whatYear();
    if (!activeYear){ 
        return;
    }
    let mainNoms = activeYear.querySelector('.main-noms');
    let dopNoms = activeYear.querySelector('.dop-noms');
    if (category === 'main') {
        mainNoms.style.display = 'block';
        dopNoms.style.display = 'none';
    } else {
        mainNoms.style.display = 'none';
        dopNoms.style.display = 'block';
    }
    let btns = activeYear.querySelectorAll('.switch-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}


let faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    let question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});


const winners2026 = [
    { id: 'king-2026', title: 'SABL KING', person: 'Иван Копылов', description: 'Человек, чей авторитет и самые завозные моменты знают все.' },
    { id: 'meme-2026', title: 'Человек-мем года', person: 'Антон Плаксин', description: 'Все смешные моменты и мемы в классе somehow связаны именно с ним.' },
    { id: 'queen-2026', title: 'SABL QUEEN', person: 'Алексей Ахмадулин', description: 'Человек, который умеет скрасить самый обычный школьный день.' },
    { id: 'bomboclat-2026', title: 'Bomboclat года', person: 'Егор Скрипчак', description: 'Самый взрывной человек. Его зажигательные моменты уже стали легендой.' },
    { id: 'zavoz-2026', title: 'Лучший завозер', person: 'Артём Корниенко', description: 'Его завозы помнят все - и их можно назвать легендарными.' },
    { id: 'teacher-2026', title: 'Учителя года', person: 'Самородов Максим Андреевич', description: 'Учитель, которого будут вспоминать ещё много лет.' },
    { id: 'event-2026', title: 'Событие года', person: 'Стена в чём-то перед НВЛ', description: 'Момент, который заслужил отдельную страницу в архиве.' },
    { id: 'fail-2026', title: 'Фейл года', person: 'Перенос НВЛ на 2 месяца', description: 'Иногда история запоминается именно потому, что пошла не по плану.' },
    { id: 'genius-2026', title: 'Гений года', person: 'Максим Толмачёв', description: 'За идеи, которые появляются раньше, чем остальные успевают их понять.' },
    { id: 'style-2026', title: 'Стиль года', person: 'Олег Бондаренко', description: 'Образ, который сам стал частью школьной хроники.' },
    { id: 'charisma-2026', title: 'Харизма года', person: 'Илья Перов', description: 'Энергия, которую невозможно не заметить.' },
    { id: 'surprise-2026', title: 'Человек-сюрприз года', person: 'Пак Анатолий', description: 'Тот самый неожиданный поворот, которого никто не планировал.' }
];

let currentIndex = getDayOfYear() % winners2026.length;

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function renderDailyCard() {
    let winner = winners2026[currentIndex];
    let container = document.getElementById('weekly-card-content');
    container.innerHTML = `
        <h3>${winner.title}</h3>
        <p><strong>${winner.person}</strong> - ${winner.description}</p>
    `;
}

function nextStory() {
    currentIndex = (currentIndex + 1) % winners2026.length;
    renderDailyCard();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.archive-btn')[0].classList.add('active');
    document.querySelectorAll('.switch-btn')[0].classList.add('active');
    renderDailyCard();
    document.getElementById('new-story-button').addEventListener('click', nextStory);
});
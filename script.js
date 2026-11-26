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

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.archive-btn')[0].classList.add('active');
    document.querySelectorAll('.switch-btn')[0].classList.add('active');
});
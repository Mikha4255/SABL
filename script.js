'use strict'

const first_btn = document.querySelector('.fuga1_3');
const sxaxancjancnapijcnij = "MjAyNjA1MDk=";
const closeBtn = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.modal-overlay');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const bnt42 = document.getElementById('site42');

first_btn.addEventListener('click', () => {
    const title = first_btn.dataset.title; 
    const text = first_btn.dataset.text;   
    modalTitle.textContent = title;
    modalText.textContent = text; 
    modal.classList.add('active');
}); 


closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

overlay.addEventListener('click', () => {
  modal.classList.remove('active');
});

bnt42.addEventListener('click', () => {
  window.open("https://yandex.ru/video/preview/6579578352626963874?text=42%20клип%20пятерка&path=yandex_search&parent-reqid=1761407840961505-17418252129132845094-balancer-l7leveler-kubr-yp-sas-20-BAL&from_type=vast").focus();
});

var first_link = false;

document.forms.date.onsubmit = function(){
    var message = this.code.value;
    if (btoa(message) == sxaxancjancnapijcnij){
        first_link = true;
        modal.style.display = 'none';
        first_btn.style.display = 'none';
        console.log("Вот первая часть ссылки: https://d");
    } else{
        alert("Попробуй ещё раз!");
    }
    return false;
}

if(first_link){
    console.log("Вот первая часть ссылки");
}

function updateTimer() {
    const targetDate = new Date('2026-05-11T00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft < 0) {
        document.getElementById('timer').innerHTML = 'Время пришло!';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('timer').innerHTML = 
        days + ' дней ' + 
        hours + ' часов ' + 
        minutes + ' минут ' +  
        seconds + ' секунд';
}

setInterval(updateTimer, 1000);
updateTimer();


function updateMessage() {
    const message = document.getElementById('opi');
    message.style.display = 'block';
    if (window.innerWidth > 700) {
        message.innerHTML = 'До приблизительной даты премии осталось:';
        message.style.color = '#ff6600'
        document.getElementById('timer').style.display = 'block';
    } else {
        message.innerHTML = 'Лучше используйте компьютерную версию сайта';
        message.style.fontSize = '55px';
        message.style.color = '#ae0606'
        document.getElementById('timer').style.display = 'none';
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


const images = [
    "вспомогательные_объекты/SABL_1.png",
    "вспомогательные_объекты/SABL_2.png",
    "вспомогательные_объекты/SABL_3.png",
    "вспомогательные_объекты/SABL_4.png",
    "вспомогательные_объекты/SABL_5.png",
    "вспомогательные_объекты/SABL_6.png",
    "вспомогательные_объекты/SABL_7.png",
    "вспомогательные_объекты/SABL_8.png",
    "вспомогательные_объекты/SABL_9.png",
    "вспомогательные_объекты/SABL_10.png",
    "вспомогательные_объекты/SABL_11.png",
    "вспомогательные_объекты/SABL_12.png",
];

let imgIndex = 0;
const imgElement = document.getElementById('rotating-image');

function preloadImages() {
    images.forEach(src => { 
        const img = new Image();
        img.src = src;
    });
}

function rotateImage() {
    imgElement.classList.remove('loaded');
    setTimeout(() => {
        imgIndex = (imgIndex + 1) % images.length;
        imgElement.src = images[imgIndex];
        imgElement.classList.add('loaded');
    }, 1000);
}

function initSlideshow() {
    preloadImages();
    imgElement.src = images[0];
    imgElement.classList.add('loaded');
    setInterval(rotateImage, 5500);
}

document.addEventListener('DOMContentLoaded', initSlideshow);
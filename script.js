'use strict'

//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
//"Вот ты сюда заглянул, чтобы не проходить квест, а ведь я старался. Он простой. Пройти его можно буквально за 5 минут. Пройди пж"
const first_btn = document.querySelector('.fuga1_3');
const second_btn = document.querySelector('.a5opka2_3');
const third_btn = document.querySelector('.a42_3');
const sxaxancjancnapijcnij = "MjAyNjA1MDk=";
const anjcndbcishbcihdbihkcanocjan = "NDI=";
const qidqouhisygutfyrytufiguohiphcugyft = "OTg4";
const closeBtn = document.querySelector('.close-modal');
let finishing = document.querySelector('.quiz_finish');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.modal-overlay');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const bnt = document.querySelector('.goyda');
const bnt42 = document.getElementById('site42');
let first_link = true;
let second_link = true;
let third_link = true;
let finish = "not_finish";

function updateStageUI() { 
  if(finish == "not_finish"){ 
    console.log("Не закончено");
  } else{
    alert("Поднимись на верх");
    finishing.style.display = 'flex';
    finishing.style.opacity = '1'; 
    document.getElementById("text_finish").innerText = "Ну что, квест завёршён теперь тебе открыт папка с правилами премии SABL2026, а также видосик, который и так будет запощен в ТГ канале.";
  }
}

first_btn.addEventListener('click', () => {
    const title = first_btn.dataset.title; 
    const text = first_btn.dataset.text;   
    modalTitle.textContent = title;
    modalText.textContent = text; 
    modal.classList.add('active');
}); 

second_btn.addEventListener('click', () => {
    const title = second_btn.dataset.title; 
    const text = second_btn.dataset.text;   
    modalTitle.textContent = title;
    modalText.textContent = text; 
    document.querySelector('.goyda').placeholder = "Введите ответ на вопрос жизни, вселенной и вообще";
    modal.classList.add('active');
});

third_btn.addEventListener('click', () => {
    const title = third_btn.dataset.title; 
    const text = third_btn.dataset.text;   
    modalTitle.textContent = title;
    modalText.textContent = text; 
    document.querySelector('.goyda').placeholder = "Введите год крещения Руси";
    modal.classList.add('active');
});

bnt.addEventListener('focus', () => {
  bnt.style.borderColor = "#ffd500ff";
  bnt.style.outline = 'none';
});

bnt.addEventListener('blur', () => {
  bnt.style.borderColor = '';
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

let form = document.querySelector("#modal_form");
form.addEventListener("submit", function(event){
  event.preventDefault();
  let data = new FormData(form);
  let user_answ = data.get("code");
  if(btoa(user_answ) == sxaxancjancnapijcnij && first_link){
      console.log("Вот первая часть ссылки: https://d");
      first_btn.style.display = 'none';
      second_btn.style.display = 'block';
      form.reset(); 
      modal.classList.remove('active');
      first_link = false;
  } else if(btoa(user_answ) == anjcndbcishbcihdbihkcanocjan && second_link){
      console.log("Вот вторая часть ссылки: isk.yandex.ru/");
      second_btn.style.display = 'none';
      third_btn.style.display = 'block';
      form.reset();
      modal.classList.remove('active');
      second_link = false;
  } else if(btoa(user_answ) == qidqouhisygutfyrytufiguohiphcugyft && third_link){
      console.log("Вот третья часть ссылки: d/MdR_dvpZVhAwLA");
      third_btn.style.display = 'none';
      modal.classList.remove('active');
      third_link = false;
      form.reset();
      finish = "finished";
      updateStageUI();
  } else{
      alert("Попробуй ещё раз")
  }
});


function updateTimer() {
    const targetDate = new Date('2026-05-11T19:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft < 0) {
        document.getElementById('timer').innerHTML = 'ВСЕ НА ПРЕМИЮ';
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


const modal2 = document.querySelector('.modal2');
const modalOverlay2 = document.querySelector('.modal-overlay2');
const modalClose2 = document.querySelector('.close-modal2');
const modal2Title = document.querySelector('.modal2-title');
const modal2Text = document.querySelector('.modal2-text');
const modal2Img = document.querySelector('.modal2-img');

function openModal2(title, text, imgSrc) {
    modal2Title.textContent = title;
    modal2Text.textContent = text;
    modal2Img.src = imgSrc;
    modal2.classList.add('active');
    setTimeout(() => {
        modal2.classList.add('visible');
    }, 200);
}

function closeModal2() {
    modal2.classList.remove('visible');
    setTimeout(() => {
        modal2.classList.remove('active');
    }, 300);
}

modalClose2.addEventListener('click', closeModal2);
modalOverlay2.addEventListener('click', closeModal2);

document.querySelectorAll('#year2026 .most_nom .nomcard').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.dataset.title;
        const text = card.dataset.text;
        const imgSrc = card.dataset.img;
        openModal2(title, text, imgSrc);
    });
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
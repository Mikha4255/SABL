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
const resetBtn = document.querySelector('.reset-progress');
const resetBtn2 = document.querySelector('.reset-progress2');
let finishing = document.querySelector('.quiz_finish');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.modal-overlay');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const bnt = document.querySelector('.goyda');
const bnt42 = document.getElementById('site42');


function showProgressInConsole() {
    const stages = {
        'stage1': 'Первая часть: https://d',
        'stage2': 'Вторая часть: isk.yandex.ru/',
        'stage3': 'Третья часть: d/MdR_dvpZVhAwLA'
    };
    const completedStages = [];
    if (localStorage.getItem('stage1_completed')) completedStages.push(stages.stage1);
    if (localStorage.getItem('stage2_completed')) completedStages.push(stages.stage2);
    if (localStorage.getItem('stage3_completed')) completedStages.push(stages.stage3);
    if (completedStages.length > 0) {
        console.log('%c╔═══════════════════════════╗', 'color: #ff6600');
        console.log('%c║   ВАШ ПРОГРЕСС В КВЕСТЕ   ║', 'color: #ff6600; font-weight: bold');
        console.log('%c╚═══════════════════════════╝', 'color: #ff6600');
        
        completedStages.forEach((stage, i) => {
            console.log(`%c✓ ${stage}`, 'color: #4CAF50; font-size: 14px');
        });
        
        console.log(`%cПрогресс: ${completedStages.length}/3 этапов`, 'color: #2196F3; font-weight: bold');
    }
}

showProgressInConsole();

function getQuestStage() {
    return localStorage.getItem("quest_stage") || "stage1";
}

function setQuestStage(stage) {
    localStorage.setItem("quest_stage", stage);
}

if (!localStorage.getItem("quest_initialized")) {
    localStorage.setItem("quest_initialized", "true");
    setQuestStage("stage1");
}

let currentStage = getQuestStage();

function updateStageUI() {
    first_btn.style.display = 'none';
    second_btn.style.display = 'none';
    third_btn.style.display = 'none';
    switch(currentStage) {
        case "stage1":
            first_btn.style.display = 'block';
            break;
        case "stage2":
            second_btn.style.display = 'block';
            break;
        case "stage3":
            third_btn.style.display = 'block';
            break;
        case "finished":
            finishing.style.display = 'flex';
            finishing.style.opacity = '1';
            resetBtn2.style.display = 'block';
            document.getElementById("text_finish").innerHTML = `<p>Ну что, квест завёршён теперь тебе открыт <a href="https://disk.yandex.ru/i/4OpLfF8TMFqYwA" target="_blank">папка с правилами премии SABL2026</a>, а также видосик, который и так будет запощен в ТГ канале.</p>`;
            break;
    }
}

updateStageUI();

function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс квеста? Страница будет перезагружена.")) {
        localStorage.removeItem('quest_initialized');
        localStorage.removeItem('quest_stage');
        localStorage.removeItem('stage1_completed');
        localStorage.removeItem('stage2_completed');
        localStorage.removeItem('stage3_completed');
        location.reload();
    }
}

resetBtn.addEventListener('click', resetProgress);
resetBtn2.addEventListener('click', resetProgress);

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
    if(currentStage === "stage1" && btoa(user_answ) === sxaxancjancnapijcnij) {
        console.log(`%c✓ Вот первая часть ссылки: https://d`, 'color: #4CAF50; font-size: 14px');
        setQuestStage("stage2");
        localStorage.setItem('stage1_completed', 'true');
        currentStage = "stage2";
        form.reset(); 
        modal.classList.remove('active');
        updateStageUI();
    } 
    else if(currentStage === "stage2" && btoa(user_answ) === anjcndbcishbcihdbihkcanocjan) {
        console.log(`%c✓ Вот вторая часть ссылки: isk.yandex.ru/`, 'color: #4CAF50; font-size: 14px');
        setQuestStage("stage3");
        localStorage.setItem('stage2_completed', 'true');
        currentStage = "stage3";
        form.reset();
        modal.classList.remove('active');
        updateStageUI();
    } 
    else if(currentStage === "stage3" && btoa(user_answ) === qidqouhisygutfyrytufiguohiphcugyft) {
        console.log(`%c✓ Вот третья часть ссылки: d/MdR_dvpZVhAwLA`, 'color: #4CAF50; font-size: 14px');
        setQuestStage("finished");
        localStorage.setItem('stage3_completed', 'true');
        currentStage = "finished";
        form.reset();
        modal.classList.remove('active');
        updateStageUI();
    } 
    else {
        alert("Попробуй ещё раз");
    }
});


function updateTimer() {
    const targetDate = new Date('2026-02-23T00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft < 0) {
        document.getElementById('timer').innerHTML = 'Голосование началось';
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
        message.innerHTML = 'До голосования за дополнительные номинации осталось:';
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
    if(index > 42){
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
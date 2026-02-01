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
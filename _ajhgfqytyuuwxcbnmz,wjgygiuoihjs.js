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
];

let currentIndex = 0;
let isTransitioning = false;
const imgElement = document.getElementById('rotating-image');
const counterElement = document.getElementById('slideshow-counter');
const prevBtn = document.querySelector('.slideshow-btn--prev');
const nextBtn = document.querySelector('.slideshow-btn--next');

function preloadImages() {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function updateSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    imgElement.classList.remove('loaded');
    setTimeout(() => {
        imgElement.src = images[index];
        imgElement.classList.add('loaded');
        counterElement.textContent = `${index + 1}/${images.length}`;
        isTransitioning = false;
    }, 300);
}

function goToNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlide(currentIndex);
}

function goToPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSlide(currentIndex);
}

function initSlideshow() {
    preloadImages();
    updateSlide(0);
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
}

document.addEventListener('DOMContentLoaded', initSlideshow);
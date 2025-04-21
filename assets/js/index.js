
const slides = document.querySelectorAll('.slide');
const pauseBtn = document.getElementById('pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const indicatorsContainer = document.querySelector('.slides-indicators');
let currentSlide = 0;
let isPlaying = true;
let timerId = null;
const INTERVAL = 2000;

function createIndicators() {
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === currentSlide) indicator.classList.add('active');
        indicator.addEventListener('click', () => gotoSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
}

function gotoSlide(index) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');
}

function startSlider() {
    timerId = setInterval(() => gotoSlide(currentSlide + 1), INTERVAL);
}

function pauseSlider() {
    clearInterval(timerId);
    isPlaying = false;
    pauseBtn.textContent = '▶';
}

function playSlider() {
    isPlaying = true;
    pauseBtn.textContent = '⏸';
    startSlider();
}

pauseBtn.addEventListener('click', () => {
    isPlaying ? pauseSlider() : playSlider();
});

prevBtn.addEventListener('click', () => {
    pauseSlider();
    gotoSlide(currentSlide - 1);
});

nextBtn.addEventListener('click', () => {
    pauseSlider();
    gotoSlide(currentSlide + 1);
});

document.querySelector('.header__slider').addEventListener('mouseenter', pauseSlider);
document.querySelector('.header__slider').addEventListener('mouseleave', () => {
    if (isPlaying) playSlider();
});

createIndicators();
startSlider();

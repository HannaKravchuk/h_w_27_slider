document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const pauseBtn = document.getElementById('pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const indicatorsContainer = document.querySelector('.slides-indicators');
    const slider = document.querySelector('.header__slider');
    let currentSlide = 0;
    let isPlaying = true;
    let timerId = null;
    let touchStartX = 0;
    let touchEndX = 0;
    const INTERVAL = 2000;
    const SWIPE_THRESHOLD = 50;

    function initSlider() {
        createIndicators();
        startSlider();
        setupEventListeners();
    }

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
        pauseBtn.setAttribute('aria-label', 'Play');
    }

    function playSlider() {
        isPlaying = true;
        pauseBtn.textContent = '⏸';
        pauseBtn.setAttribute('aria-label', 'Pause');
        startSlider();
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
            pauseSlider();
            gotoSlide(currentSlide + 1);
        } else if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
            pauseSlider();
            gotoSlide(currentSlide - 1);
        }
    }

    function setupEventListeners() {
        pauseBtn.addEventListener('click', () => isPlaying ? pauseSlider() : playSlider());
        prevBtn.addEventListener('click', () => {
            pauseSlider();
            gotoSlide(currentSlide - 1);
        });
        nextBtn.addEventListener('click', () => {
            pauseSlider();
            gotoSlide(currentSlide + 1);
        });

        slider.addEventListener('mouseenter', pauseSlider);
        slider.addEventListener('mouseleave', () => isPlaying && playSlider());

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.code) {
                case 'ArrowLeft':
                    pauseSlider();
                    gotoSlide(currentSlide - 1);
                    break;
                case 'ArrowRight':
                    pauseSlider();
                    gotoSlide(currentSlide + 1);
                    break;
                case 'Space':
                    e.preventDefault();
                    isPlaying ? pauseSlider() : playSlider();
                    break;
            }
        });

        prevBtn.addEventListener('focus', pauseSlider);
        nextBtn.addEventListener('focus', pauseSlider);
        pauseBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
        prevBtn.setAttribute('aria-label', 'Previous slide');
        nextBtn.setAttribute('aria-label', 'Next slide');
    }

    initSlider();
});

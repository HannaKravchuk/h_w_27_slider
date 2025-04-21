document.addEventListener('DOMContentLoaded', function() {
    const config = {
        interval: 2000,
        swipeThreshold: 50,
        dragThreshold: 30
    };

    const elements = {
        slider: document.querySelector('.header__slider'),
        slides: document.querySelectorAll('.slide'),
        pauseBtn: document.getElementById('pause'),
        prevBtn: document.getElementById('prev'),
        nextBtn: document.getElementById('next'),
        indicatorsContainer: document.querySelector('.slides-indicators')
    };

    const state = {
        currentSlide: 0,
        isPlaying: true,
        timerId: null,
        isDragging: false,
        startX: 0,
        currentX: 0
    };

    function init() {
        createIndicators();
        setupEventListeners();
        startSlider();
        setAccessibility();
    }

    function createIndicators() {
        elements.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === state.currentSlide) indicator.classList.add('active');
            indicator.addEventListener('click', () => gotoSlide(index));
            elements.indicatorsContainer.appendChild(indicator);
        });
    }

    function gotoSlide(index) {
        elements.slides[state.currentSlide].classList.remove('active');
        document.querySelectorAll('.indicator')[state.currentSlide].classList.remove('active');
        
        state.currentSlide = (index + elements.slides.length) % elements.slides.length;
        
        elements.slides[state.currentSlide].classList.add('active');
        document.querySelectorAll('.indicator')[state.currentSlide].classList.add('active');
    }
    function startSlider() {
        if (state.timerId) clearInterval(state.timerId);
        state.timerId = setInterval(() => gotoSlide(state.currentSlide + 1), config.interval);
        state.isPlaying = true;
        elements.pauseBtn.textContent = '⏸';
    }

    function pauseSlider() {
        clearInterval(state.timerId);
        state.isPlaying = false;
        elements.pauseBtn.textContent = '▶';
    }

    function setupEventListeners() {
        elements.pauseBtn.addEventListener('click', togglePlay);
        elements.prevBtn.addEventListener('click', () => { pauseSlider(); gotoSlide(state.currentSlide - 1); });
        elements.nextBtn.addEventListener('click', () => { pauseSlider(); gotoSlide(state.currentSlide + 1); });

        elements.slider.addEventListener('mouseenter', pauseSlider);
        elements.slider.addEventListener('mouseleave', () => state.isPlaying && startSlider());

        elements.slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        elements.slider.addEventListener('touchmove', handleTouchMove, { passive: false });
        elements.slider.addEventListener('touchend', handleTouchEnd);

        elements.slider.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        document.addEventListener('keydown', handleKeyDown);
    }

    function handleTouchStart(e) {
        state.startX = e.touches[0].clientX;
        state.currentX = state.startX;
    }

    function handleTouchMove(e) {
        if (!state.isDragging) {
            const diff = Math.abs(e.touches[0].clientX - state.startX);
            if (diff > config.dragThreshold) {
                state.isDragging = true;
                pauseSlider();
            }
        }
        
        if (state.isDragging) {
            e.preventDefault();
            state.currentX = e.touches[0].clientX;
        }
    }

    function handleTouchEnd() {
        if (state.isDragging) {
            handleDragEnd();
            state.isDragging = false;
        }
    }

    function handleMouseDown(e) {
        state.isDragging = true;
        state.startX = e.clientX;
        state.currentX = state.startX;
        pauseSlider();
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (state.isDragging) {
            state.currentX = e.clientX;
        }
    }

    function handleMouseUp() {
        if (state.isDragging) {
            handleDragEnd();
            state.isDragging = false;
        }
    }

    function handleDragEnd() {
        const diff = state.currentX - state.startX;
        
        if (Math.abs(diff) > config.swipeThreshold) {
            if (diff < 0) {
                gotoSlide(state.currentSlide + 1); 
            } else {
                gotoSlide(state.currentSlide - 1); 
            }
        }
        
        if (state.isPlaying) {
            startSlider();
        }
    }

    function handleKeyDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.code) {
            case 'ArrowLeft':
                pauseSlider();
                gotoSlide(state.currentSlide - 1);
                break;
            case 'ArrowRight':
                pauseSlider();
                gotoSlide(state.currentSlide + 1);
                break;
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
        }
    }

    function togglePlay() {
        state.isPlaying ? pauseSlider() : startSlider();
    }

    function setAccessibility() {
        elements.pauseBtn.setAttribute('aria-label', state.isPlaying ? 'Pause' : 'Play');
        elements.prevBtn.setAttribute('aria-label', 'Previous slide');
        elements.nextBtn.setAttribute('aria-label', 'Next slide');
    }

    init();
});
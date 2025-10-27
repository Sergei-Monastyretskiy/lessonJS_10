// Константи
const SLIDES_COUNT = 3;
const CODE_ARROW_LEFT = 'ArrowLeft';
const CODE_ARROW_RIGHT = 'ArrowRight';
const CODE_SPACE = 'Space';
const FA_PAUSE = '<i class="fas fa-pause"></i>';
const FA_PLAY = '<i class="fas fa-play"></i>';
const TIMER_INTERVAL = 2000;

// Змінні
let currentSlide = 0;
let isPlaying = true;
let timerId = null;
let swipeStartX = 0;
let swipeEndX = 0;

// Змінні для елементів DOM
let carousel, slidesContainer, slides, indicators, indicatorsContainer, pauseBtn, prevBtn, nextBtn;

// Функція для оновлення активного слайду та індикатора
function updateSlide() {
    // Видаляємо клас active з усіх слайдів та індикаторів
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Додаємо клас active до поточного слайду та індикатора
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Функція для переходу до наступного слайду
function nextSlide() {
    currentSlide = (currentSlide + 1) % SLIDES_COUNT;
    updateSlide();
}

// Функція для переходу до попереднього слайду
function prevSlide() {
    currentSlide = (currentSlide - 1 + SLIDES_COUNT) % SLIDES_COUNT;
    updateSlide();
}

// Функція для переходу до конкретного слайду
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlide();
}

// Функція для запуску автоматичного перемикання
function startAutoPlay() {
    if (!isPlaying) return;
    timerId = setInterval(() => {
        nextSlide();
    }, TIMER_INTERVAL);
}

// Функція для зупинки автоматичного перемикання
function stopAutoPlay() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

// Функція для перемикання стану паузи/відтворення
function togglePlayPause() {
    if (isPlaying) {
        stopAutoPlay();
        pauseBtn.innerHTML = FA_PLAY;
        isPlaying = false;
    } else {
        isPlaying = true;
        pauseBtn.innerHTML = FA_PAUSE;
        startAutoPlay();
    }
}// Обробник кліку на кнопку паузи/відтворення
function pausePlayHandler() {
    togglePlayPause();
}

// Обробник кліку на кнопку "наступний"
function nextHandler() {
    stopAutoPlay();
    nextSlide();
    isPlaying = false;
    pauseBtn.innerHTML = FA_PLAY;
}

// Обробник кліку на кнопку "попередній"
function prevHandler() {
    stopAutoPlay();
    prevSlide();
    isPlaying = false;
    pauseBtn.innerHTML = FA_PLAY;
}

// Обробник кліку на індикатор
function indicatorClickHandler(event) {
    if (event.target.classList.contains('indicator')) {
        stopAutoPlay();
        const slideIndex = parseInt(event.target.getAttribute('data-slide-to'));
        goToSlide(slideIndex);
        isPlaying = false;
        pauseBtn.innerHTML = FA_PLAY;
    }
}

// Обробник натискання клавіш
function keydownHandler(event) {
    switch (event.code) {
        case CODE_ARROW_LEFT:
            stopAutoPlay();
            prevSlide();
            isPlaying = false;
            pauseBtn.innerHTML = FA_PLAY;
            break;
        case CODE_ARROW_RIGHT:
            stopAutoPlay();
            nextSlide();
            isPlaying = false;
            pauseBtn.innerHTML = FA_PLAY;
            break;
        case CODE_SPACE:
            event.preventDefault();
            togglePlayPause();
            break;
    }
}

// Обробник початку свайпу
function swipeStartHandler(event) {
    if (event.type === 'mousedown') {
        swipeStartX = event.clientX;
    } else if (event.type === 'touchstart') {
        swipeStartX = event.changedTouches[0].clientX;
    }
}

// Обробник завершення свайпу
function swipeEndHandler(event) {
    if (event.type === 'mouseup') {
        swipeEndX = event.clientX;
    } else if (event.type === 'touchend') {
        swipeEndX = event.changedTouches[0].clientX;
    }

    handleSwipe();
}

// Функція для обробки свайпу
function handleSwipe() {
    const swipeDistance = swipeEndX - swipeStartX;

    if (Math.abs(swipeDistance) > 100) {
        stopAutoPlay();

        if (swipeDistance > 100) {
            // Свайп вправо - попередній слайд
            prevSlide();
        } else if (swipeDistance < -100) {
            // Свайп вліво - наступний слайд
            nextSlide();
        }

        isPlaying = false;
        pauseBtn.innerHTML = FA_PLAY;
    }

    swipeStartX = 0;
    swipeEndX = 0;
}

// Функція ініціалізації
function init() {
    // Отримання елементів DOM
    carousel = document.querySelector('#carousel');
    slidesContainer = document.querySelector('#slides-container');
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    indicatorsContainer = document.querySelector('#indicators-container');
    pauseBtn = document.querySelector('#pause-btn');
    prevBtn = document.querySelector('#prev-btn');
    nextBtn = document.querySelector('#next-btn');

    // Перевіряємо, чи знайдені всі необхідні елементи
    if (!carousel || !slidesContainer || !slides.length || !indicators.length || !indicatorsContainer || !pauseBtn || !prevBtn || !nextBtn) {
        return; // Виходимо, якщо елементи не знайдені
    }

    // Встановлюємо початковий стан
    updateSlide();    // Навішуємо обробники подій на кнопки
    pauseBtn.addEventListener('click', pausePlayHandler);
    nextBtn.addEventListener('click', nextHandler);
    prevBtn.addEventListener('click', prevHandler);

    // Навішуємо обробник на контейнер індикаторів (делегування)
    indicatorsContainer.addEventListener('click', indicatorClickHandler);

    // Навішуємо обробник клавіатури на документ
    document.addEventListener('keydown', keydownHandler);

    // Навішуємо обробники свайпів на контейнер слайдів
    // Для миші
    slidesContainer.addEventListener('mousedown', swipeStartHandler);
    slidesContainer.addEventListener('mouseup', swipeEndHandler);

    // Для сенсорних пристроїв
    slidesContainer.addEventListener('touchstart', swipeStartHandler);
    slidesContainer.addEventListener('touchend', swipeEndHandler);

    // Запускаємо автоматичне перемикання
    startAutoPlay();
}

// Запускаємо ініціалізацію після завантаження DOM або відразу, якщо DOM вже готовий
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* =====================================================
   SCRIPT.JS — ПОЛНАЯ РАБОЧАЯ ВЕРСИЯ
   ===================================================== */

(() => {

"use strict";

/* =====================================================
   ЧАСТЬ 1: ЛАМПА + DRAG/TOUCH
   ===================================================== */

const ropeHandle = document.getElementById("ropeHandle");
const lampshade = document.getElementById("lampshade");
const lightGlow = document.getElementById("lightGlow");
const lightRays = document.getElementById("lightRays");
const lampContainer = document.getElementById("lampContainer");
const loginCard = document.getElementById("loginCard");
const mainWrapper = document.getElementById("mainWrapper");

let isLampOn = false;
let isDragging = false;
let wasDragged = false;
let startY = 0;
let glowAnimationFrame = null;

// Глобальные переменные для выбора всех категорий
let selectedRestaurantDish = null;
let selectedRestaurantImage = null;
let selectedRestaurantKitchen = null;
let selectedWalkPlace = null;
let selectedWalkIndex = null;
let selectedGift = null;
let selectedDate = null;

function cancelLampAnimation() {
    if (glowAnimationFrame) {
        cancelAnimationFrame(glowAnimationFrame);
        glowAnimationFrame = null;
    }
}

function setGlowValues(glow, rays) {
    if (lightGlow) lightGlow.setAttribute("opacity", Math.max(0, Math.min(1, glow)));
    if (lightRays) lightRays.setAttribute("opacity", Math.max(0, Math.min(1, rays)));
}

function turnOnLamp() {
    if (isLampOn) return;
    isLampOn = true;
    cancelLampAnimation();
    lampContainer?.classList.add("active");
    loginCard?.classList.add("active");
    if (lampshade) lampshade.setAttribute("fill", "#C97E4C");
    
    let glow = 0, rays = 0;
    function animate() {
        glow += 0.045;
        rays += 0.03;
        setGlowValues(glow, rays);
        if (glow >= 0.95) {
            setGlowValues(0.95, 0.65);
            glowAnimationFrame = null;
            return;
        }
        glowAnimationFrame = requestAnimationFrame(animate);
    }
    animate();
    if (window.startBackgroundParticles) window.startBackgroundParticles();
}

function turnOffLamp() {
    if (!isLampOn) return;
    isLampOn = false;
    cancelLampAnimation();
    lampContainer?.classList.remove("active");
    loginCard?.classList.remove("active");
    if (lampshade) lampshade.setAttribute("fill", "#4A3530");
    
    let glow = parseFloat(lightGlow?.getAttribute("opacity") || 0);
    let rays = parseFloat(lightRays?.getAttribute("opacity") || 0);
    function animate() {
        glow -= 0.06;
        rays -= 0.06;
        setGlowValues(glow, rays);
        if (glow <= 0) {
            setGlowValues(0, 0);
            glowAnimationFrame = null;
            return;
        }
        glowAnimationFrame = requestAnimationFrame(animate);
    }
    animate();
    if (window.stopBackgroundParticles) window.stopBackgroundParticles();
}

function toggleLamp() {
    isLampOn ? turnOffLamp() : turnOnLamp();
}

function handleDragStart(event) {
    if (!ropeHandle) return;
    const point = event.touches?.[0] || event;
    startY = point.clientY;
    isDragging = true;
    wasDragged = false;
    ropeHandle.style.transition = "transform .05s linear";
    event.preventDefault();
}

function handleDragMove(event) {
    if (!isDragging) return;
    const point = event.touches?.[0] || event;
    const deltaY = point.clientY - startY;
    if (deltaY > 10) wasDragged = true;
    if (ropeHandle && deltaY > 0 && deltaY < 40) {
        ropeHandle.style.transform = 'translateY(' + (deltaY * 0.35) + 'px)';
    }
    if (deltaY > 40) {
        isDragging = false;
        ropeHandle.style.transform = "";
        ropeHandle.style.transition = "";
        toggleLamp();
    }
}

function handleDragEnd() {
    if (!ropeHandle) return;
    ropeHandle.style.transform = "";
    ropeHandle.style.transition = "";
    isDragging = false;
    setTimeout(() => { wasDragged = false; }, 120);
}

if (ropeHandle) {
    ropeHandle.addEventListener("mousedown", handleDragStart);
    ropeHandle.addEventListener("touchstart", handleDragStart, { passive: false });
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchend", handleDragEnd);
    ropeHandle.addEventListener("click", () => { if (!wasDragged) toggleLamp(); });
}

function initializeLamp() {
    setGlowValues(0, 0);
    lampContainer?.classList.remove("active");
    loginCard?.classList.remove("active");
    if (lampshade) lampshade.setAttribute("fill", "#4A3530");
}
initializeLamp();

window.turnOnLamp = turnOnLamp;
window.turnOffLamp = turnOffLamp;
window.toggleLamp = toggleLamp;

/* =====================================================
   ЧАСТЬ 2: ЧАСТИЦЫ + ИСКРЫ + МАГИЧЕСКИЙ СЛЕД
   ===================================================== */

const particlesContainer = document.getElementById("particlesContainer");
const sparklesOverlay = document.getElementById("sparklesOverlay");
const magicTrail = document.getElementById("magicTrail");

let particlesInterval = null;

function createParticle() {
    if (!particlesContainer) return;
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 8 + 4;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 80 + 10 + "%";
    particle.style.animationDuration = Math.random() * 3 + 2 + "s";
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 5500);
}

function startBackgroundParticles() {
    stopBackgroundParticles();
    particlesInterval = setInterval(() => {
        for (let i = 0; i < 3; i++) createParticle();
    }, 450);
}

function stopBackgroundParticles() {
    if (particlesInterval) {
        clearInterval(particlesInterval);
        particlesInterval = null;
    }
    if (particlesContainer) particlesContainer.innerHTML = "";
}

window.startBackgroundParticles = startBackgroundParticles;
window.stopBackgroundParticles = stopBackgroundParticles;
window.createParticle = createParticle;

function createSpark(x, y) {
    if (!sparklesOverlay) return;
    const spark = document.createElement("div");
    spark.className = "spark";
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 70;
    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.setProperty("--tx", tx + "px");
    spark.style.setProperty("--ty", ty + "px");
    sparklesOverlay.appendChild(spark);
    setTimeout(() => spark.remove(), 1300);
}

function burstSparkles(centerX, centerY, count = 50) {
    if (centerX === undefined || centerY === undefined) {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
    }
    for (let i = 0; i < count; i++) {
        setTimeout(() => createSpark(centerX, centerY), i * 15);
    }
}

function burstAtCenter() {
    burstSparkles(window.innerWidth / 2, window.innerHeight / 2, 70);
}

window.burstSparkles = burstSparkles;
window.burstAtCenter = burstAtCenter;

function createMagicRing() {
    const ring = document.createElement("div");
    ring.className = "magic-ring";
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1500);
}
window.createMagicRing = createMagicRing;

let trailEnabled = true;
function createTrailDot(x, y) {
    if (!magicTrail || !trailEnabled) return;
    const dot = document.createElement("div");
    dot.className = "trail-dot";
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    magicTrail.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
}

window.addEventListener("mousemove", (e) => createTrailDot(e.clientX, e.clientY));
window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (touch) createTrailDot(touch.clientX, touch.clientY);
}, { passive: true });

setInterval(() => {
    if (magicTrail && magicTrail.children.length > 120) {
        while (magicTrail.children.length > 60) magicTrail.firstChild?.remove();
    }
}, 2000);

function updatePerformanceMode() { trailEnabled = window.innerWidth >= 600; }
window.addEventListener("resize", updatePerformanceMode);
updatePerformanceMode();

setTimeout(() => burstAtCenter(), 600);

/* =====================================================
   ЧАСТЬ 3: ФОРМА + КАРТОЧКИ + КРИТЕРИИ + ФИНАЛЬНЫЙ ЭКРАН
   ===================================================== */

const form = document.getElementById("inviteForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const formMessage = document.getElementById("formMessage");
const cardsShow = document.getElementById("cardsShow");
const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");
const card3 = document.getElementById("card3");

const cards = [card1, card2, card3];
let currentCardIndex = 0;
let isSequenceRunning = false;

function resetCards() {
    cards.forEach(card => {
        if (card) card.classList.remove("active", "exit");
    });
    currentCardIndex = 0;
}

function hideIntroScreen() {
    return new Promise(resolve => {
        if (mainWrapper) mainWrapper.classList.add("hide");
        setTimeout(() => resolve(), 900);
    });
}

function showCard(index) {
    const card = cards[index];
    if (!card) return;
    card.classList.add("active");
    burstAtCenter();
    for (let i = 0; i < 50; i++) createParticle();
}

function exitCard(index) {
    const card = cards[index];
    if (!card) return;
    card.classList.add("exit");
    burstAtCenter();
}

function startCardsSequence() {
    if (isSequenceRunning) return;
    isSequenceRunning = true;
    resetCards();
    if (cardsShow) cardsShow.style.opacity = "1";

    showCard(0);
    setTimeout(() => {
        exitCard(0);
        setTimeout(() => {
            card1?.classList.remove("active", "exit");
            showCard(1);
            setTimeout(() => {
                exitCard(1);
                setTimeout(() => {
                    card2?.classList.remove("active", "exit");
                    showCard(2);
                    prepareReadyButton();
                }, 1000);
            }, 4000);
        }, 1000);
    }, 4500);
}

function prepareReadyButton() {
    const button = document.getElementById("readyBtn");
    if (!button) return;
    const newButton = button.cloneNode(true);
    button.parentNode?.replaceChild(newButton, button);
    newButton.addEventListener("click", handleReadyClick);
}

function handleReadyClick() {
    if (card3) card3.classList.add("exit");
    burstAtCenter();
    setTimeout(() => showCriteriaScreen(), 600);
}

// Данные для фотографий по кухням
const kitchenImages = {
    italian: [
        { img: "image/it_food.jpg", caption: "Здрасьте! Нам по пасте!" },
        { img: "image/it_food2.jpg", caption: "Добрые соседи" }
    ],
    japanese: [
        { img: "image/jp_food.jpg", caption: "Якитория" },
        { img: "image/jp_food2.jpg", caption: "Шикари" }
    ],
    french: [
        { img: "image/fr_food1.jpg", caption: "Тот еще гусь" },
        { img: "image/fr_food2.jpg", caption: "We Cidreria" }
    ],
    georgian: [
        { img: "image/ge_food.jpg", caption: "SLAVA" },
        { img: "image/ge_food2.jpg", caption: "Кинза" }
    ],
    european: [
        { img: "image/eu_food.jpg", caption: "Nicepricecafe" },
        { img: "image/eu_food2.jpg", caption: "True Cost" }
    ]
};

function areAllCategoriesSelected() {
    return selectedRestaurantDish !== null && selectedWalkPlace !== null && selectedGift !== null;
}

function initKitchenChoice() {
    const kitchenOptionsContainer = document.getElementById('kitchenOptions');
    if (!kitchenOptionsContainer) return;
    
    kitchenOptionsContainer.addEventListener('click', (e) => {
        const kitchenOption = e.target.closest('.kitchen-option');
        if (!kitchenOption) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        document.querySelectorAll('.kitchen-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        kitchenOption.classList.add('selected');
        
        const kitchenKey = kitchenOption.getAttribute('data-kitchen');
        const kitchenNameSpan = kitchenOption.querySelector('span');
        const kitchenName = kitchenNameSpan ? kitchenNameSpan.textContent : kitchenKey;
        
        selectedRestaurantKitchen = kitchenName;
        loadKitchenPhotos(kitchenKey, kitchenName);
        selectedRestaurantDish = null;
        selectedRestaurantImage = null;
        
        const selectedDisplay = document.getElementById('selectedRestaurantDisplay');
        if (selectedDisplay) selectedDisplay.style.display = 'none';
        
        burstAtCenter();
        for(let i = 0; i < 5; i++) createParticle();
        alert(`🍽️ Кухня "${kitchenName}" загружена! Теперь выберите конкретное блюдо.`);
    });
}

function loadKitchenPhotos(kitchenKey, kitchenName) {
    const carouselContainer = document.getElementById('restaurantCarousel');
    const carouselInner = carouselContainer?.querySelector('.carousel-inner');
    const dotsContainer = carouselContainer?.querySelector('.carousel-dots');
    
    if (!carouselInner) return;
    
    const images = kitchenImages[kitchenKey];
    if (!images) return;
    
    carouselInner.innerHTML = '';
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.setAttribute('data-dish-name', image.caption);
        slide.setAttribute('data-dish-image', image.img);
        slide.innerHTML = `
            <img src="${image.img}" alt="${image.caption}" onerror="this.src='https://placehold.co/400x250?text=${encodeURIComponent(image.caption)}'">
            <div class="carousel-caption">${image.caption}</div>
        `;
        carouselInner.appendChild(slide);
    });
    
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < images.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
    }
    
    carouselContainer.style.display = 'block';
    setTimeout(() => carouselContainer.classList.add('visible'), 10);
    initRestaurantCarouselNav(carouselContainer, images.length);
}

function initRestaurantCarouselNav(carouselContainer, totalSlides) {
    const carouselInner = carouselContainer.querySelector('.carousel-inner');
    const prevBtn = carouselContainer.querySelector('.carousel-prev');
    const nextBtn = carouselContainer.querySelector('.carousel-next');
    const restaurantCard = document.getElementById('criteriaRestaurant');
    
    let currentIndex = 0;
    if (restaurantCard) restaurantCard.setAttribute('data-current-slide', currentIndex);
    
    const updateCurrentSlide = () => {
        if (restaurantCard) restaurantCard.setAttribute('data-current-slide', currentIndex);
    };
    
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
        const dots = carouselContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            if (i === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
        updateCurrentSlide();
    }
    
    function nextSlide() { currentIndex = (currentIndex + 1) % totalSlides; updateCarousel(); }
    function prevSlide() { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; updateCarousel(); }
    
    if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.onclick = (e) => { e.stopPropagation(); prevSlide(); };
    }
    if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.onclick = (e) => { e.stopPropagation(); nextSlide(); };
    }
    
    const dots = carouselContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.onclick = (e) => { e.stopPropagation(); currentIndex = i; updateCarousel(); };
    });
    updateCarousel();
}

function initAllCarousels() {
    const criteriaItems = document.querySelectorAll('.criteria-item:not([data-type="restaurant"])');
    
    criteriaItems.forEach(item => {
        const carouselInner = item.querySelector('.carousel-inner');
        const prevBtn = item.querySelector('.carousel-prev');
        const nextBtn = item.querySelector('.carousel-next');
        const dotsContainer = item.querySelector('.carousel-dots');
        if (!carouselInner) return;
        
        const slides = carouselInner.querySelectorAll('.carousel-slide');
        let currentIndex = 0;
        const totalSlides = slides.length;
        if (totalSlides === 0) return;
        
        carouselInner.style.display = "flex";
        carouselInner.style.transition = "transform 0.4s ease";
        
        // Для прогулки и подарка сохраняем текущий индекс
        if (item.id === 'criteriaWalk' || item.id === 'criteriaGift') {
            item.setAttribute('data-current-slide', currentIndex);
            
            const updateCurrentSlide = () => {
                item.setAttribute('data-current-slide', currentIndex);
            };
            
            if (dotsContainer) {
                dotsContainer.innerHTML = "";
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement("div");
                    dot.classList.add("carousel-dot");
                    if (i === 0) dot.classList.add("active");
                    dot.addEventListener("click", (e) => {
                        e.stopPropagation();
                        currentIndex = i;
                        const offset = -currentIndex * 100;
                        carouselInner.style.transform = `translateX(${offset}%)`;
                        updateCarouselDots();
                        updateCurrentSlide();
                    });
                    dotsContainer.appendChild(dot);
                }
            }
            
            function updateCarouselDots() {
                const dots = item.querySelectorAll(".carousel-dot");
                dots.forEach((dot, i) => {
                    if (i === currentIndex) dot.classList.add("active");
                    else dot.classList.remove("active");
                });
            }
            
            if (prevBtn) {
                const newPrevBtn = prevBtn.cloneNode(true);
                prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
                newPrevBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    const offset = -currentIndex * 100;
                    carouselInner.style.transform = `translateX(${offset}%)`;
                    updateCarouselDots();
                    updateCurrentSlide();
                });
            }
            if (nextBtn) {
                const newNextBtn = nextBtn.cloneNode(true);
                nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
                newNextBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % totalSlides;
                    const offset = -currentIndex * 100;
                    carouselInner.style.transform = `translateX(${offset}%)`;
                    updateCarouselDots();
                    updateCurrentSlide();
                });
            }
            const offset = -currentIndex * 100;
            carouselInner.style.transform = `translateX(${offset}%)`;
            updateCarouselDots();
            updateCurrentSlide();
        } else {
            // Для других категорий
            if (dotsContainer) {
                dotsContainer.innerHTML = "";
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement("div");
                    dot.classList.add("carousel-dot");
                    if (i === 0) dot.classList.add("active");
                    dot.addEventListener("click", (e) => {
                        e.stopPropagation();
                        goToSlide(i);
                    });
                    dotsContainer.appendChild(dot);
                }
            }
            function updateCarousel() {
                const offset = -currentIndex * 100;
                carouselInner.style.transform = `translateX(${offset}%)`;
                const dots = item.querySelectorAll(".carousel-dot");
                dots.forEach((dot, i) => {
                    if (i === currentIndex) dot.classList.add("active");
                    else dot.classList.remove("active");
                });
            }
            function goToSlide(index) { currentIndex = Math.max(0, Math.min(index, totalSlides - 1)); updateCarousel(); }
            function nextSlide() { currentIndex = (currentIndex + 1) % totalSlides; updateCarousel(); }
            function prevSlide() { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; updateCarousel(); }
            
            if (prevBtn) {
                const newPrevBtn = prevBtn.cloneNode(true);
                prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
                newPrevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevSlide(); });
            }
            if (nextBtn) {
                const newNextBtn = nextBtn.cloneNode(true);
                nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
                newNextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextSlide(); });
            }
            updateCarousel();
        }
    });
}

function initCriteriaButtons() {
    const selectBtns = document.querySelectorAll(".criteria-select-btn");
    selectBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const option = newBtn.getAttribute("data-option");
            
            if (option === "restaurant") {
                const restaurantCard = document.getElementById('criteriaRestaurant');
                const currentSlideIndex = restaurantCard?.getAttribute('data-current-slide');
                const carouselContainer = document.getElementById('restaurantCarousel');
                const carouselInner = carouselContainer?.querySelector('.carousel-inner');
                const slides = carouselInner?.querySelectorAll('.carousel-slide');
                
                if (slides && currentSlideIndex !== null && slides[currentSlideIndex]) {
                    const selectedSlide = slides[currentSlideIndex];
                    const dishName = selectedSlide.getAttribute('data-dish-name') || `Блюдо ${parseInt(currentSlideIndex) + 1}`;
                    selectedRestaurantDish = dishName;
                    const displayDiv = document.getElementById('selectedRestaurantDisplay');
                    const dishNameSpan = document.getElementById('restaurantDishName');
                    if (displayDiv && dishNameSpan) {
                        dishNameSpan.textContent = dishName;
                        displayDiv.style.display = 'inline-block';
                    }
                    slides.forEach(slide => { slide.style.border = 'none'; slide.style.boxShadow = 'none'; });
                    selectedSlide.style.border = '2px solid #ffb35c';
                    selectedSlide.style.borderRadius = '20px';
                    selectedSlide.style.boxShadow = '0 0 15px rgba(255, 180, 80, 0.5)';
                    alert(`✅ Блюдо "${dishName}" выбрано! Осталось выбрать прогулку и подарок.`);
                } else {
                    alert("✨ Сначала выберите кухню, затем конкретное блюдо!");
                    return;
                }
            } else if (option === "walk") {
                const walkCard = document.getElementById('criteriaWalk');
                const currentSlideIndex = walkCard?.getAttribute('data-current-slide');
                const carouselInner = walkCard?.querySelector('.carousel-inner');
                const slides = carouselInner?.querySelectorAll('.carousel-slide');
                
                if (slides && currentSlideIndex !== null && slides[currentSlideIndex]) {
                    const selectedSlide = slides[currentSlideIndex];
                    const placeName = selectedSlide.querySelector('.carousel-caption')?.textContent || `Место ${parseInt(currentSlideIndex) + 1}`;
                    selectedWalkPlace = placeName;
                    const displayDiv = document.getElementById('selectedWalkPlace');
                    const placeSpan = document.getElementById('walkPlaceName');
                    if (displayDiv && placeSpan) {
                        placeSpan.textContent = selectedWalkPlace;
                        displayDiv.style.display = 'inline-block';
                    }
                    slides.forEach(slide => { slide.style.border = 'none'; slide.style.boxShadow = 'none'; });
                    selectedSlide.style.border = '2px solid #ffb35c';
                    selectedSlide.style.borderRadius = '20px';
                    selectedSlide.style.boxShadow = '0 0 15px rgba(255, 180, 80, 0.5)';
                    alert(`✅ Место "${selectedWalkPlace}" сохранено! Осталось выбрать подарок.`);
                } else {
                    alert("✨ Сначала выберите место в карусели!");
                    return;
                }
            } else if (option === "gift") {
                const giftCard = document.getElementById('criteriaGift');
                const currentSlideIndex = giftCard?.getAttribute('data-current-slide');
                const carouselInner = giftCard?.querySelector('.carousel-inner');
                const slides = carouselInner?.querySelectorAll('.carousel-slide');
                
                if (slides && currentSlideIndex !== null && slides[currentSlideIndex]) {
                    const selectedSlide = slides[currentSlideIndex];
                    const giftName = selectedSlide.querySelector('.carousel-caption')?.textContent || `Подарок ${parseInt(currentSlideIndex) + 1}`;
                    selectedGift = giftName;
                    
                    alert(`✅ Подарок "${selectedGift}" выбран! Осталось выбрать ресторан и прогулку.`);
                    
                    slides.forEach(slide => {
                        slide.style.border = 'none';
                        slide.style.boxShadow = 'none';
                    });
                    selectedSlide.style.border = '2px solid #ffb35c';
                    selectedSlide.style.borderRadius = '20px';
                    selectedSlide.style.boxShadow = '0 0 15px rgba(255, 180, 80, 0.5)';
                } else {
                    alert("✨ Сначала выберите подарок в карусели!");
                    return;
                }
            }
            
            if (areAllCategoriesSelected()) {
                alert("🎉 Все критерии выбраны!");
                const screen = document.getElementById("criteriaScreen");
                if (screen) {
                    screen.classList.remove("active");
                    setTimeout(() => {
                        screen.style.display = "none";
                        showFinalScreen();
                    }, 400);
                }
                burstAtCenter();
            }
        });
    });
}

function showFinalConfirmationScreen() {
    const confirmScreen = document.getElementById("confirmationScreen");
    if (!confirmScreen) return;
    
    const confirmIcon = document.getElementById("confirmationIcon");
    const confirmTitle = document.getElementById("confirmationTitle");
    const confirmBadge = document.getElementById("confirmationBadge");
    
    if (confirmIcon) confirmIcon.textContent = "💖✨✨💖";
    if (confirmTitle) confirmTitle.textContent = "Отлично! Ты выбрала:";
    
    const walkText = selectedWalkPlace || "не выбрано";
    const restaurantText = selectedRestaurantDish || "не выбрано";
    const giftText = selectedGift || "не выбран";
    
    if (confirmBadge) confirmBadge.innerHTML = `
        <div style="text-align: left; padding: 5px;">
            <div style="margin-bottom: 18px; display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2rem; width: 55px;">🚶‍♀️</div>
                <div><div style="font-size: 0.85rem; color: #ffc491;">МЕСТО ПРОГУЛКИ</div><div style="font-size: 1.2rem; font-weight: 700;">${walkText}</div></div>
            </div>
            <div style="margin-bottom: 18px; display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2rem; width: 55px;">🍽️</div>
                <div><div style="font-size: 0.85rem; color: #ffc491;">РЕСТОРАН</div><div style="font-size: 1.2rem; font-weight: 700;">${restaurantText}</div></div>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2rem; width: 55px;">🎁</div>
                <div><div style="font-size: 0.85rem; color: #ffc491;">ПОДАРОК</div><div style="font-size: 1.2rem; font-weight: 700;">${giftText}</div></div>
            </div>
        </div>
    `;
    
    confirmScreen.style.display = "flex";
    setTimeout(() => confirmScreen.classList.add("active"), 50);
    
    const closeBtn = document.getElementById("confirmationCloseBtn");
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener("click", () => {
            confirmScreen.classList.remove("active");
            setTimeout(() => confirmScreen.style.display = "none", 400);
            burstAtCenter();
        });
    }
}

function showCriteriaScreen() {
    if (cardsShow) cardsShow.style.opacity = "0";
    const screen = document.getElementById("criteriaScreen");
    if (screen) {
        screen.style.display = "flex";
        setTimeout(() => screen.classList.add("active"), 50);
        initAllCarousels();
        initKitchenChoice();
        initCriteriaButtons();
    }
}

function validateForm() {
    const first = firstName?.value?.trim();
    const last = lastName?.value?.trim();
    if (!first) { formMessage.innerHTML = "✨ Введите имя ✨"; return false; }
    if (!last) { formMessage.innerHTML = "🌸 Введите фамилию 🌸"; return false; }
    formMessage.innerHTML = "";
    return true;
}

async function handleFormSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;
    await hideIntroScreen();
    startCardsSequence();
}

form?.addEventListener("submit", handleFormSubmit);

function initializeApp() {
    resetCards();
    if (cardsShow) cardsShow.style.opacity = "0";
    if (formMessage) formMessage.innerHTML = "";
    if (firstName) firstName.value = "";
    if (lastName) lastName.value = "";
    selectedRestaurantDish = null;
    selectedRestaurantImage = null;
    selectedRestaurantKitchen = null;
    selectedWalkPlace = null;
    selectedGift = null;
    selectedDate = null;
}

initializeApp();

/* =====================================================
   СОХРАНЕНИЕ ДАННЫХ
   ===================================================== */

function saveDataLocally() {
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString('ru-RU', dateOptions) : 'не выбрана';
    
    const message = `✨ СВИДАНИЕ СОБРАНО! ✨
    
🚶‍♀️ Прогулка: ${selectedWalkPlace || 'не выбрано'}
🍽️ Ресторан: ${selectedRestaurantDish || 'не выбрано'}
🎁 Подарок: ${selectedGift || 'не выбран'}
📅 Дата: ${formattedDate}

💖 Пусть этот вечер станет незабываемым! 💖

📅 Сохранено: ${new Date().toLocaleString()}`;
    
    const dataToSave = {
        walk: selectedWalkPlace,
        restaurant: selectedRestaurantDish,
        gift: selectedGift,
        date: formattedDate,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedDateData', JSON.stringify(dataToSave));
    console.log('✅ Данные сохранены в localStorage:', dataToSave);
    
    navigator.clipboard.writeText(message).then(() => {
        console.log('✅ Данные скопированы в буфер обмена');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
    });
    
    return message;
}

/* =====================================================
   ОТПРАВКА ДАННЫХ В GOOGLE ТАБЛИЦУ
   ===================================================== */

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbytzdokPR4HJyzcy8zueutvZkig6XU19nkxhIlDdyR27pLycTwLbZsUvFM-0lbDmGRTjg/exec';

async function sendToGoogleSheets() {
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString('ru-RU', dateOptions) : 'не выбрана';
    
    const data = {
        firstName: firstName?.value?.trim() || '',
        lastName: lastName?.value?.trim() || '',
        walk: selectedWalkPlace || 'не выбрано',
        restaurant: selectedRestaurantDish || 'не выбрано',
        gift: selectedGift || 'не выбран',
        date: formattedDate
    };
    
    try {
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        console.log('✅ Данные отправлены в Google Таблицу');
    } catch (error) {
        console.error('❌ Ошибка отправки:', error);
    }
}

/* =====================================================
   ФИНАЛЬНОЕ ОКНО
   ===================================================== */

function showFinalSummaryScreen() {
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString('ru-RU', dateOptions) : 'не выбрана';
    
    const walkElement = document.getElementById('finalWalkValue');
    const restaurantElement = document.getElementById('finalRestaurantValue');
    const giftElement = document.getElementById('finalGiftValue');
    const dateElement = document.getElementById('finalDateValue');
    
    if (walkElement) walkElement.textContent = selectedWalkPlace || 'не выбрано';
    if (restaurantElement) restaurantElement.textContent = selectedRestaurantDish || 'не выбрано';
    if (giftElement) giftElement.textContent = selectedGift || 'не выбран';
    if (dateElement) dateElement.textContent = formattedDate;
    
    sendToGoogleSheets();
    saveDataLocally();
    
    const screen = document.getElementById('finalSummaryScreen');
    if (screen) {
        screen.style.display = 'flex';
        setTimeout(() => screen.classList.add('active'), 50);
        
        const closeBtn = document.getElementById('finalSummaryCloseBtn');
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.addEventListener('click', () => {
                screen.classList.remove('active');
                setTimeout(() => screen.style.display = 'none', 400);
                burstAtCenter();
                for(let i = 0; i < 50; i++) createParticle();
                
                // ПОКАЗЫВАЕМ КАРТОЧКУ РАЗРАБОТЧИКА
                showDeveloperCard();
            });
        }
    }
}

/* =====================================================
   ЭКРАН ВЫБОРА ДАТЫ
   ===================================================== */

function showDateScreen() {
    const dateScreen = document.getElementById('dateScreen');
    if (!dateScreen) return;
    
    selectedDate = null;
    const datePicker = document.getElementById('nativeDatePicker');
    const selectedDisplay = document.getElementById('selectedDateDisplay');
    const selectedTextSpan = document.getElementById('selectedDateText');
    const nextBtn = document.getElementById('dateNextBtn');
    
    if (!nextBtn) return;
    nextBtn.disabled = true;
    
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    if (datePicker) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        datePicker.min = `${year}-${month}-${day}`;
        datePicker.value = '';
        
        const newDatePicker = datePicker.cloneNode(true);
        datePicker.parentNode.replaceChild(newDatePicker, datePicker);
        
        newDatePicker.addEventListener('change', (e) => {
            const dateValue = e.target.value;
            if (dateValue) {
                selectedDate = new Date(dateValue);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                if (selectedTextSpan) selectedTextSpan.textContent = selectedDate.toLocaleDateString('ru-RU', options);
                if (selectedDisplay) selectedDisplay.style.display = 'block';
                const currentNextBtn = document.getElementById('dateNextBtn');
                if (currentNextBtn) currentNextBtn.disabled = false;
                burstAtCenter();
            } else {
                selectedDate = null;
                if (selectedDisplay) selectedDisplay.style.display = 'none';
                const currentNextBtn = document.getElementById('dateNextBtn');
                if (currentNextBtn) currentNextBtn.disabled = true;
            }
        });
    }
    
    newNextBtn.addEventListener('click', () => {
        if (selectedDate) {
            dateScreen.classList.remove('active');
            setTimeout(() => {
                dateScreen.style.display = 'none';
                showFinalSummaryScreen();
            }, 400);
            burstAtCenter();
        } else {
            alert("📅 Пожалуйста, выберите дату свидания!");
        }
    });
    
    dateScreen.style.display = 'flex';
    setTimeout(() => dateScreen.classList.add('active'), 50);
}

function showFinalScreen() {
    const screen = document.getElementById("finalScreen");
    if (screen) {
        screen.style.display = "flex";
        setTimeout(() => screen.classList.add("active"), 50);
        const finalBtn = document.getElementById("finalBtn");
        if (finalBtn) {
            const newFinalBtn = finalBtn.cloneNode(true);
            finalBtn.parentNode.replaceChild(newFinalBtn, finalBtn);
            newFinalBtn.addEventListener("click", () => {
                burstAtCenter();
                screen.classList.remove("active");
                setTimeout(() => {
                    screen.style.display = "none";
                    showDateScreen();
                }, 400);
            });
        }
    }
}

/* =====================================================
   ПРОФИЛЬНАЯ КАРТОЧКА РАЗРАБОТЧИКА (С ТРЕМЯ ЛИНИЯМИ)
   ===================================================== */

let developerSocialInitialized = false;

function showDeveloperCard() {
    let overlay = document.getElementById('developerCardOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'developerCardOverlay';
        overlay.className = 'developer-card-overlay';
        document.body.appendChild(overlay);
    }
    
    const developerCard = document.getElementById('developerCard');
    if (developerCard) {
        developerCard.classList.remove('show');
        overlay.classList.remove('show');
        
        developerCard.style.display = 'block';
        overlay.style.display = 'block';
        
        setTimeout(() => {
            overlay.classList.add('show');
            developerCard.classList.add('show');
        }, 50);
        
        initDeveloperSocial();
        
        overlay.onclick = (e) => {
            e.stopPropagation();
            hideDeveloperCard(overlay, developerCard);
        };
        
        developerCard.onclick = (e) => {
            e.stopPropagation();
        };
    }
}

function hideDeveloperCard(overlay, developerCard) {
    // Закрываем социальные ссылки, если они открыты
    const socialLinks = document.getElementById('developerSocial');
    const menuBtn = document.getElementById('developerMenuBtn');
    if (socialLinks && socialLinks.classList.contains('show')) {
        socialLinks.classList.remove('show');
    }
    if (menuBtn && menuBtn.classList.contains('show-icon')) {
        menuBtn.classList.remove('show-icon');
    }
    
    if (overlay) overlay.classList.remove('show');
    if (developerCard) developerCard.classList.remove('show');
    
    setTimeout(() => {
        if (developerCard) developerCard.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    }, 500);
}

function initDeveloperSocial() {
    if (developerSocialInitialized) return;
    developerSocialInitialized = true;
    
    const menuBtn = document.getElementById('developerMenuBtn');
    const socialLinks = document.getElementById('developerSocial');
    
    if (menuBtn && socialLinks) {
        const newMenuBtn = menuBtn.cloneNode(true);
        menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
        
        newMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            socialLinks.classList.toggle('show');
            newMenuBtn.classList.toggle('show-icon');
        });
        
        document.addEventListener('click', (e) => {
            const card = document.querySelector('.developer-card');
            const btn = document.getElementById('developerMenuBtn');
            if (card && !card.contains(e.target) && btn && !btn.contains(e.target)) {
                socialLinks.classList.remove('show');
                if (newMenuBtn) newMenuBtn.classList.remove('show-icon');
            }
        });
    }
}



console.log("✨ ВСЁ РАБОТАЕТ! ✨");

})();
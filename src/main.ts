import './style.css'

// VARIABLES GLOBALES PARA EL CAROUSEL
let currentSlide = 0;
let slides: NodeListOf<Element>;
let totalSlides: number;
let carousel: HTMLElement | null;
let indicatorsContainer: HTMLElement | null;
let indicators: NodeListOf<Element>;
let autoAdvanceInterval: number | null = null;

// INICIALIZACIÓN DEL CAROUSEL
function initCarousel() {
    slides = document.querySelectorAll('.carousel-item');
    totalSlides = slides.length;
    carousel = document.getElementById('carousel');
    indicatorsContainer = document.getElementById('indicators');
    
    if (!carousel || !indicatorsContainer || totalSlides === 0) {
        console.error('Elementos del carousel no encontrados');
        return;
    }

    // CREACIÓN DINÁMICA DE INDICADORES
    indicatorsContainer.innerHTML = ''; // Limpiar indicadores existentes
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active'); // Primer indicador activo
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }

    indicators = document.querySelectorAll('.indicator');
    
    // Iniciar auto-avance
    startAutoAdvance();
}

// ACTUALIZACIÓN VISUAL DEL CAROUSEL
function updateCarousel() {
    if (!carousel || !indicators) return;
    
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`; // Desplazamiento horizontal
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide); // Actualiza indicadores activos
    });
}

// NAVEGACIÓN DEL CAROUSEL
function nextSlide() {
    if (totalSlides === 0) return;
    currentSlide = (currentSlide + 1) % totalSlides; // Avanza cíclicamente
    updateCarousel();
    restartAutoAdvance(); // Reiniciar auto-avance al navegar manualmente
}

function prevSlide() {
    if (totalSlides === 0) return;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // Retrocede cíclicamente
    updateCarousel();
    restartAutoAdvance(); // Reiniciar auto-avance al navegar manualmente
}

function goToSlide(index: number) {
    if (totalSlides === 0 || index < 0 || index >= totalSlides) return;
    currentSlide = index;
    updateCarousel();
    restartAutoAdvance(); // Reiniciar auto-avance al navegar manualmente
}

// AUTO-AVANCE DEL CAROUSEL CADA 5 SEGUNDOS
function startAutoAdvance() {
    stopAutoAdvance(); // Asegurar que no hay intervalos duplicados
    autoAdvanceInterval = window.setInterval(() => {
        nextSlide();
    }, 5000); // 5 segundos
}

function stopAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
    }
}

function restartAutoAdvance() {
    startAutoAdvance();
}

// SCROLL SUAVE AL HACER CLIC EN EL INDICADOR
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const carouselSection = document.querySelector('.carousel-section');
        if (carouselSection) {
            carouselSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// INTERSECTION OBSERVER PARA ANIMACIONES SCROLL-TRIGGERED
const observerOptions = {
    threshold: 0.1, // Se activa cuando el 10% del elemento es visible
    rootMargin: '0px 0px -100px 0px' // Margen negativo para activar antes
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animation = 'fadeInUp 1s ease forwards'; // Aplica animación
        }
    });
}, observerOptions);

// APLICA EL OBSERVER A TODAS LAS TARJETAS DE CULTURA
function initCultureCards() {
    document.querySelectorAll('.culture-card').forEach(card => {
        (card as HTMLElement).style.opacity = '0'; // Inicialmente ocultas
        observer.observe(card);
    });
}

// EFECTO PARALLAX EN LA TORRE DE PISA AL HACER SCROLL
function initParallax() {
    window.addEventListener('scroll', () => {
        const tower = document.querySelector('.tower-container');
        if (tower) {
            const scrollY = window.scrollY;
            (tower as HTMLElement).style.transform = `translateY(${scrollY * 0.2}px) rotate(4deg)`; // Movimiento parallax
            (tower as HTMLElement).style.opacity = Math.max(1 - scrollY / 600, 0).toString(); // Desvanecimiento progresivo
        }
    });
}

// HACER LAS FUNCIONES GLOBALES PARA ACCESO DESDE HTML
(window as any).nextSlide = nextSlide;
(window as any).prevSlide = prevSlide;
(window as any).goToSlide = goToSlide;

// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initCultureCards();
    initParallax();
});

// También inicializar inmediatamente por si el DOM ya está listo
if (document.readyState === 'loading') {
    // DOM aún cargando, el event listener se ejecutará
} else {
    // DOM ya está listo
    initCarousel();
    initCultureCards();
    initParallax();
}
import './style.css'

// VARIABLES GLOBALES PARA EL CAROUSEL
let currentSlide = 0;
let slides: NodeListOf<Element>;
let totalSlides: number;
let carousel: HTMLElement | null;
let indicatorsContainer: HTMLElement | null;
let indicators: NodeListOf<Element>;

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


function restartAutoAdvance() {
    // Función placeholder - el auto-avance fue removido por el usuario
    // Si se quiere reactivar, descomentar las funciones de auto-avance
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

// HACER LAS FUNCIONES GLOBALES PARA ACCESO DESDE HTML
(window as any).nextSlide = nextSlide;
(window as any).prevSlide = prevSlide;
(window as any).goToSlide = goToSlide;

// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initCultureCards();
});

// También inicializar inmediatamente por si el DOM ya está listo
if (document.readyState === 'loading') {
    // DOM aún cargando, el event listener se ejecutará
} else {
    // DOM ya está listo
    initCarousel();
    initCultureCards();
}
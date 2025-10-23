import './style.css'

// VARIABLES GLOBALES PARA EL CAROUSEL
let currentSlide = 0;
let slides: NodeListOf<Element>;
let totalSlides: number;
let carousel: HTMLElement | null;
let indicatorsContainer: HTMLElement | null;
let indicators: NodeListOf<Element>;
let isTransitioning = false; // FLAG PARA PREVENIR CLICS MÚLTIPLES

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
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }

    indicators = document.querySelectorAll('.indicator');
    
    // PRECARGAR VIDEOS PARA MEJOR RENDIMIENTO
    preloadVideos();
}

// PRECARGAR VIDEOS
function preloadVideos() {
    const videos = document.querySelectorAll('.carousel-item video');
    videos.forEach((video) => {
        (video as HTMLVideoElement).preload = 'auto';
    });
}

// ACTUALIZACIÓN VISUAL DEL CAROUSEL
function updateCarousel() {
    if (!carousel || !indicators) return;
    
    // Desplazamiento horizontal con translate3d para aceleración GPU
    carousel.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    
    // Actualiza indicadores activos
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // GESTIÓN DE VIDEOS: Reproducir solo el actual, pausar los demás
    manageVideos();
}

// GESTIÓN DE REPRODUCCIÓN DE VIDEOS
function manageVideos() {
    const videos = document.querySelectorAll('.carousel-item video');
    videos.forEach((video, index) => {
        const videoElement = video as HTMLVideoElement;
        if (index === currentSlide) {
            videoElement.play().catch(e => console.log('Video autoplay prevented:', e));
        } else {
            videoElement.pause();
            videoElement.currentTime = 0; // Reiniciar video cuando no está visible
        }
    });
}

// NAVEGACIÓN DEL CAROUSEL CON PROTECCIÓN ANTI-LAG
function nextSlide() {
    //if (totalSlides === 0 || isTransitioning) return; // PREVENIR CLICS DURANTE TRANSICIÓN
    
    isTransitioning = true;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
    
    // LIBERAR DESPUÉS DE LA TRANSICIÓN (400ms = duración del CSS)
    setTimeout(() => {
        isTransitioning = false;
    }, 0);
    
    restartAutoAdvance();
}

function prevSlide() {
    //if (totalSlides === 0 || isTransitioning) return; // PREVENIR CLICS DURANTE TRANSICIÓN
    
    isTransitioning = true;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
    
    // LIBERAR DESPUÉS DE LA TRANSICIÓN (400ms = duración del CSS)
    setTimeout(() => {
        isTransitioning = false;
    }, 0);
    
    restartAutoAdvance();
}

function goToSlide(index: number) {
    if (totalSlides === 0 || index < 0 || index >= totalSlides || isTransitioning) return;
    
    // No hacer nada si ya estamos en ese slide
    if (index === currentSlide) return;
    
    isTransitioning = true;
    currentSlide = index;
    updateCarousel();
    
    // LIBERAR DESPUÉS DE LA TRANSICIÓN (400ms = duración del CSS)
    setTimeout(() => {
        isTransitioning = false;
    }, 0);
    
    restartAutoAdvance();
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
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animation = 'fadeInUp 1s ease forwards';
        }
    });
}, observerOptions);

// APLICA EL OBSERVER A TODAS LAS TARJETAS DE CULTURA
function initCultureCards() {
    document.querySelectorAll('.culture-card').forEach(card => {
        (card as HTMLElement).style.opacity = '0';
        observer.observe(card);
    });
}

// FUNCIONALIDAD DE LA NAVBAR
function initNavbar() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            const target = e.target as Element;
            if (!target.closest('.navbar')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// ATAJOS DE TECLADO PARA NAVEGACIÓN
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// SOPORTE PARA GESTOS TÁCTILES EN MÓVILES
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function initTouchGestures() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    carouselContainer.addEventListener('touchstart', (e: Event) => {
        const touchEvent = e as TouchEvent;
        touchStartX = touchEvent.touches[0].clientX;
        touchStartY = touchEvent.touches[0].clientY;
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e: Event) => {
        const touchEvent = e as TouchEvent;
        touchEndX = touchEvent.touches[0].clientX;
        touchEndY = touchEvent.touches[0].clientY;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe
    const horizontalDistance = touchStartX - touchEndX;
    const verticalDistance = Math.abs(touchStartY - touchEndY);
    
    // Verificar que el swipe sea más horizontal que vertical
    if (Math.abs(horizontalDistance) > verticalDistance) {
        if (Math.abs(horizontalDistance) > swipeThreshold) {
            if (horizontalDistance > 0) {
                // Swipe hacia la izquierda - siguiente slide
                nextSlide();
            } else {
                // Swipe hacia la derecha - slide anterior
                prevSlide();
            }
        }
    }
    
    // Reset
    touchStartX = 0;
    touchEndX = 0;
    touchStartY = 0;
    touchEndY = 0;
}

// HACER LAS FUNCIONES GLOBALES PARA ACCESO DESDE HTML
(window as any).nextSlide = nextSlide;
(window as any).prevSlide = prevSlide;
(window as any).goToSlide = goToSlide;

// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCarousel();
    initCultureCards();
    initTouchGestures(); // INICIALIZAR GESTOS TÁCTILES
});

// También inicializar inmediatamente por si el DOM ya está listo
if (document.readyState === 'loading') {
    // DOM aún cargando, el event listener se ejecutará
} else {
    // DOM ya está listo
    initNavbar();
    initCarousel();
    initCultureCards();
    initTouchGestures(); // INICIALIZAR GESTOS TÁCTILES
}
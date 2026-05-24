// Design 1: Noir Élégance - Script

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initParallax();
});

// Navbar scroll effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
    }
}

// Scroll reveal animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.about, .experience, .team, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .about.visible, .experience.visible, .team.visible, .contact.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect for hero
function initParallax() {
    const heroImage = document.querySelector('.hero-image');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `scale(${1 + scrolled * 0.0005}) translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Form submission
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Merci pour votre réservation ! Nous vous contacterons bientôt.');
        form.reset();
    });
}

// Design 3: Art Déco Parisien - Script

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initScrollEffects();
    initNavigation();
});

// Menu tabs functionality
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.carte-items');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding content
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Scroll reveal effects
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.story-image, .story-content, .carte-item, .equipe-member, .carte-img, .info-card'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Add styles for visible state
    const style = document.createElement('style');
    style.textContent = `
        .animate-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Navigation effects
function initNavigation() {
    const nav = document.querySelector('.nav');

    // Scroll effect for nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.nav-mobile');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        if (input.value) {
            alert('Merci pour votre inscription !');
            input.value = '';
        }
    });
}

// Add hover effects to images
document.querySelectorAll('.image-art-frame, .hero-img').forEach(frame => {
    frame.addEventListener('mouseenter', () => {
        const img = frame.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.02)';
        }
    });

    frame.addEventListener('mouseleave', () => {
        const img = frame.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1)';
        }
    });
});

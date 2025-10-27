// Load and parse YAML content
let content = {};

async function loadContent() {
  try {
    const response = await fetch('content.yaml');
    const yamlText = await response.text();
    content = jsyaml.load(yamlText);
    populateContent();
  } catch (error) {
    console.error('Error loading content:', error);
  }
}

function populateContent() {
  // Site-wide elements
  if (content.site) {
    document.getElementById('site-title').textContent = content.site.name;

    const favicon = document.getElementById('favicon');
    if (favicon) favicon.href = content.site.favicon;
  }

  // Navigation
  if (content.navigation) {
    populateNavigation();
  }

  // HOME PAGE
  if (
    window.location.pathname.includes('index.html') ||
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('/')
  ) {
    populateHomePage();
    populateAlmasCestQuoi();
    populateQuiSommesNous();
    populateNotreCafe();
    populateVisit();
  }

  // MENU PAGE
  if (window.location.pathname.includes('menu.html')) {
    populateMenuPage();
  }

  // Footer (on all pages)
  populateFooter();
}

function populateNavigation() {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu && content.navigation) {
    navMenu.innerHTML = content.navigation
      .map(item => `<li><a href="${item.link}">${item.text}</a></li>`)
      .join('');
  }
}

function populateHomePage() {
  // Hero Section
  if (content.hero) {
    setText('hero-heading', content.hero.heading);
    setText('hero-subheading', content.hero.subheading);

    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
      heroCta.textContent = content.hero.cta_button_text;
      heroCta.href = content.hero.cta_button_link;
    }
  }
}

function populateAlmasCestQuoi() {
  if (content.almas_cest_quoi) {
    setText('almas-cest-quoi-heading', content.almas_cest_quoi.heading);
    setText('almas-cest-quoi-text', content.almas_cest_quoi.text);
    setImage('almas-cest-quoi-img', content.almas_cest_quoi.image, "Almas c'est quoi");
  }
}

function populateQuiSommesNous() {
  if (content.qui_sommes_nous) {
    setText('qui-sommes-nous-heading', content.qui_sommes_nous.heading);
    setText('qui-sommes-nous-text', content.qui_sommes_nous.text);

    const gallery = document.getElementById('qui-sommes-nous-gallery');
    if (gallery) {
      gallery.innerHTML = '';
      const images = Array.isArray(content.qui_sommes_nous.images)
        ? content.qui_sommes_nous.images
        : content.qui_sommes_nous.image
        ? [content.qui_sommes_nous.image]
        : [];

      images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Qui sommes nous ${index + 1}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        gallery.appendChild(img);
      });
    }
  }
}

function populateNotreCafe() {
  if (content.notre_cafe) {
    setText('notre-cafe-heading', content.notre_cafe.heading);
    setText('notre-cafe-text', content.notre_cafe.text);
    setImage('notre-cafe-img', content.notre_cafe.image, 'Notre cafe');

    // Populate visit cards
    const cardsContainer = document.getElementById('visit-cards');
    if (cardsContainer && content.notre_cafe.items) {
      const items = Array.isArray(content.notre_cafe.items) ? content.notre_cafe.items : [];
      cardsContainer.innerHTML = items
        .map(item => {
          const lines = Array.isArray(item.lines)
            ? item.lines.map(line => `<p>${line}</p>`).join('')
            : '';
          return `
                        <div class="visit-card">
                            <h3>${item.label || ''}</h3>
                            ${lines}
                        </div>
                    `;
        })
        .join('');
    }

    // Populate map
    const mapFrame = document.getElementById('visit-map-frame');
    if (mapFrame && content.notre_cafe.map) {
      if (content.notre_cafe.map.embed_url) {
        mapFrame.src = content.notre_cafe.map.embed_url;
      }
      mapFrame.title = content.notre_cafe.map.title || content.notre_cafe.heading || 'Carte';
    }

    const mapLink = document.getElementById('visit-map-link');
    if (mapLink && content.notre_cafe.map) {
      const linkHref =
        content.notre_cafe.map.link_url ||
        content.notre_cafe.map.embed_url?.replace('output=embed', '') ||
        '';
      if (linkHref) {
        mapLink.href = linkHref;
      }
      mapLink.title = content.notre_cafe.map.title || 'Ouvrir dans Google Maps';
    }
  }
}

function populateVisit() {
  // This function is now merged into populateNotreCafe
  // Kept for backward compatibility but does nothing
}

function populateMenuPage() {
  // Menu Hero
  if (content.menu) {
    setText('menu-heading', content.menu.heading);
    setText('menu-subheading', content.menu.subheading);

    const menuHero = document.querySelector('.menu-hero');
    if (menuHero && content.menu.hero_image) {
      menuHero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${content.menu.hero_image}')`;
    }

    // Coffee Section
    if (content.menu.coffee) {
      setText('coffee-section-title', content.menu.coffee.section_title);
      setImage('coffee-section-img', content.menu.coffee.section_image, 'Coffee');

      const coffeeItems = document.getElementById('coffee-items');
      if (coffeeItems) {
        coffeeItems.innerHTML = content.menu.coffee.items
          .map(item => createMenuItem(item))
          .join('');
      }
    }

    // Pastries Section
    if (content.menu.pastries) {
      setText('pastries-section-title', content.menu.pastries.section_title);
      setImage('pastries-section-img', content.menu.pastries.section_image, 'Pastries');

      const pastriesItems = document.getElementById('pastries-items');
      if (pastriesItems) {
        pastriesItems.innerHTML = content.menu.pastries.items
          .map(item => createMenuItem(item))
          .join('');
      }
    }

    // Lunch Section
    if (content.menu.lunch) {
      setText('lunch-section-title', content.menu.lunch.section_title);
      setImage('lunch-section-img', content.menu.lunch.section_image, 'Lunch');

      const lunchItems = document.getElementById('lunch-items');
      if (lunchItems) {
        lunchItems.innerHTML = content.menu.lunch.items.map(item => createMenuItem(item)).join('');
      }
    }
  }
}

function createMenuItem(item) {
  return `
        <div class="menu-item">
            <div class="menu-item-header">
                <h3>${item.name}</h3>
                <span class="price">${item.price}</span>
            </div>
            <p>${item.description}</p>
        </div>
    `;
}

function populateFooter() {
  if (content.footer) {
    setText('footer-tagline', content.footer.tagline);
    setText('footer-copyright', content.footer.copyright);
  }

  // Social Links
  const socialLinks = document.getElementById('social-links');
  if (socialLinks && content.social) {
    const links = [];
    if (content.social.instagram) {
      links.push(
        `<a href="${content.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="ph ph-instagram-logo"></i></a>`
      );
    }
    if (content.social.facebook) {
      links.push(
        `<a href="${content.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><i class="ph ph-facebook-logo"></i></a>`
      );
    }
    if (content.social.twitter) {
      links.push(
        `<a href="${content.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter"><i class="ph ph-twitter-logo"></i></a>`
      );
    }
    socialLinks.innerHTML = links.join('');
  }
}

// Helper functions
function setText(id, text) {
  const element = document.getElementById(id);
  if (element && text) {
    // For headings with SugarMagic font, wrap ? and ' with fallback font
    if (element.tagName === 'H2' && text.match(/[\?']/)) {
      const wrappedText = text
        .replace(/\?/g, '<span class="fallback-char">?</span>')
        .replace(/'/g, '<span class="fallback-char">\'</span>');
      element.innerHTML = wrappedText;
    } else {
      element.textContent = text;
    }
  }
}

function setImage(id, src, alt) {
  const element = document.getElementById(id);
  if (element && src) {
    element.src = src;
    if (!element.getAttribute('loading')) {
      element.setAttribute('loading', 'lazy');
    }
    element.setAttribute('decoding', 'async');
    if (alt) element.alt = alt;
  }
}

// Hero Slideshow with Ken Burns Effect
let currentSlide = 0;
let slides = [];
let navbar = null;
let heroSlideshow = null;
let lastScrollY = 0;

function initSlideshow() {
  slides = document.querySelectorAll('.hero-slide');

  function nextSlide() {
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  // Change slide every 7 seconds (matching the animation duration)
  if (slides.length > 1) {
    setInterval(nextSlide, 7000);
  }
}

function initScrollEffects() {
  navbar = document.querySelector('.navbar-below-hero');
  heroSlideshow = document.querySelector('.hero-slideshow');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const hero = document.querySelector('.hero');
  const sectionContainers = document.querySelectorAll(
    '.almas-cest-quoi-image, .qui-sommes-nous-image'
  );

  // Cache container data to avoid repeated DOM queries and classList checks
  const containerData = Array.from(sectionContainers)
    .map(container => {
      const images = Array.from(container.querySelectorAll('img'));
      const isGallery = container.classList.contains('qui-sommes-nous-image');
      const isAlmas = container.classList.contains('almas-cest-quoi-image');
      const parallaxRange = isAlmas ? 24 : 16;
      const speedMultipliers = [0.5, 1.0, 1.5];

      return {
        element: container,
        images,
        isGallery,
        parallaxRange,
        speedMultipliers,
      };
    })
    .filter(data => data.images.length > 0);

  let ticking = false;
  let heroHeight = hero ? hero.offsetHeight : 0;

  // Cache hero height and recalculate on resize
  window.addEventListener('resize', () => {
    heroHeight = hero ? hero.offsetHeight : 0;
  });

  const updateScrollEffects = () => {
    const scrollY = window.scrollY;

    // Fade out scroll indicator when scrolling
    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrollY > 50 ? '0' : '1';
    }

    // Sticky navbar style change
    if (navbar) {
      if (scrollY > 800) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Slideshow shrink effect with blur (TV border)
    if (heroSlideshow && scrollY < heroHeight) {
      const scrollPercent = Math.min(scrollY / heroHeight, 1);

      // TV Frame effects - dramatic shrink
      const scaleX = 1 - scrollPercent * 0.25;
      const scaleY = 1 - scrollPercent * 0.15;
      const borderRadius = Math.min(scrollPercent / 0.1, 1) * 16;
      const blur = scrollPercent * 20;

      // Apply effects
      heroSlideshow.style.transform = `translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`;
      heroSlideshow.style.borderRadius = `${borderRadius}px`;

      if (slides.length > 0) {
        slides.forEach(slide => {
          slide.style.filter = `blur(${blur}px)`;
        });
      }
    }

    // Parallax effects - using cached data
    const windowHeight = window.innerHeight;
    containerData.forEach(data => {
      const rect = data.element.getBoundingClientRect();

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollPast = Math.max(0, windowHeight - rect.top);
        const maxScroll = windowHeight + rect.height;
        const scrollPercent = Math.min(scrollPast / maxScroll, 1);
        const parallaxY = (scrollPercent - 0.5) * data.parallaxRange;

        data.images.forEach((img, index) => {
          img.style.removeProperty('transform');
          const speedMultiplier =
            data.isGallery && data.speedMultipliers[index] ? data.speedMultipliers[index] : 1.0;
          const adjustedParallaxY = parallaxY * speedMultiplier;
          img.style.setProperty('--parallax-offset', `${adjustedParallaxY}%`);
        });
      }
    });

    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight * 0.85) {
      element.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Logo trace animation
function animateLogo() {
  const logo = document.querySelector('.hero-logo');
  if (!logo) return;

  const paths = logo.querySelectorAll('path');

  // Order paths from left to right based on their position
  const pathsArray = Array.from(paths);
  const pathsWithPos = pathsArray.map((path, originalIndex) => {
    const bbox = path.getBBox();
    return {
      path: path,
      x: bbox.x,
      originalIndex: originalIndex,
    };
  });

  // Sort by x position (left to right)
  pathsWithPos.sort((a, b) => a.x - b.x);

  pathsWithPos.forEach((item, index) => {
    const path = item.path;
    const length = path.getTotalLength();

    // Set up the starting positions
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // Animate the stroke after a small delay - left to right
    setTimeout(() => {
      path.style.transition = 'stroke-dashoffset 1.5s ease-out';
      path.style.strokeDashoffset = '0';
    }, index * 250); // Stagger each path by position
  });

  // After tracing is done, fill in the logo
  // Start filling earlier - while the last letter is still drawing
  const totalAnimationTime = pathsWithPos.length * 250 + 200;
  setTimeout(() => {
    logo.classList.add('filled');
  }, totalAnimationTime);

  // Fade in the tagline after logo animation is complete
  const tagline = document.getElementById('hero-subheading');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (tagline) {
    setTimeout(() => {
      tagline.classList.add('show');
      if (scrollIndicator) {
        setTimeout(() => {
          scrollIndicator.classList.add('show');
        }, 400); // show scroll prompt shortly after the tagline
      }
    }, totalAnimationTime + 2000); // After fill animation completes (2s)
  } else if (scrollIndicator) {
    setTimeout(() => {
      scrollIndicator.classList.add('show');
    }, totalAnimationTime + 2400);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize slideshow
  initSlideshow();

  // Initialize scroll effects
  initScrollEffects();

  // Animate logo on load
  animateLogo();

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Load content
  loadContent();
});

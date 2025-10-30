let content = {};
let domElements = {};
let animationState = {
  currentSlide: 0,
  slides: [],
  heroHeight: 0,
  ticking: false,
  revealElements: [],
};

async function loadContent() {
  try {
    const response = await fetch("content.yaml");
    const yamlText = await response.text();
    content = jsyaml.load(yamlText);
    populateContent();
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

function populateContent() {
  if (content.site) {
    document.getElementById("site-title").textContent = content.site.name;
  }

  const isHomePage =
    ["/", "/index.html"].includes(window.location.pathname) ||
    window.location.pathname.endsWith("/");

  if (isHomePage) {
    populateHomePage();
    populateAlmasCestQuoi();
    populateQuiSommesNous();
    populateNotreCafe();
  }

  if (window.location.pathname.includes("menu.html")) {
    populateMenuPage();
  }

  populateFooter();

  // Lazy load Mapbox when user scrolls near the map section
  lazyLoadMapbox();
}

function lazyLoadMapbox() {
  const mapContainer = document.getElementById("mapbox-map");
  if (!mapContainer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Load Mapbox CSS
          const mapboxCSS = document.createElement("link");
          mapboxCSS.rel = "stylesheet";
          mapboxCSS.href =
            "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css";
          document.head.appendChild(mapboxCSS);

          // Load Mapbox JS
          const mapboxJS = document.createElement("script");
          mapboxJS.src =
            "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js";
          mapboxJS.onload = initMapbox;
          document.head.appendChild(mapboxJS);

          observer.disconnect();
        }
      });
    },
    { rootMargin: "200px" }
  );

  observer.observe(mapContainer);
}

function initMapbox() {
  if (typeof mapboxgl === "undefined" || !document.getElementById("mapbox-map"))
    return;

  mapboxgl.accessToken =
    "pk.eyJ1IjoiZWxlY3RyaWthbGV4IiwiYSI6ImNtaDlxbzFzazFic2kya3BjOGF0bm92Z24ifQ.-8evErzgCBHn8QWWuHmkSA";

  const cafeCoordinates = [2.3509551, 48.8771733];
  const map = new mapboxgl.Map({
    container: "mapbox-map",
    style: "mapbox://styles/electrikalex/cmhaeskgh001v01qyapsg1xpe",
    center: cafeCoordinates,
    zoom: 14,
    scrollZoom: false,
    attributionControl: false,
  });

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

  const el = document.createElement("div");
  el.className = "custom-marker";
  el.style.cssText = "width:42px;height:58px;cursor:pointer;position:relative;";
  el.innerHTML = `
    <img src="/images/pin.svg" style="width:42px;height:58px;display:block;" alt="Location pin">
    <img src="/favicon/favicon.svg" style="position:absolute;top:2px;left:50%;transform:translateX(-50%);width:38px;height:38px;filter:brightness(0) invert(1);" alt="ALMAS">
  `;

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    window.open("https://maps.app.goo.gl/wBbG7msv6UKrpCJu5", "_blank");
  });

  new mapboxgl.Marker(el, { anchor: "bottom" })
    .setLngLat(cafeCoordinates)
    .addTo(map);

  map.on("click", () => map.scrollZoom.enable());
  map
    .getCanvas()
    .addEventListener("mouseleave", () => map.scrollZoom.disable());
}

function populateHomePage() {
  if (content.hero) {
    setText("hero-heading", content.hero.heading);
    setText("hero-subheading", content.hero.subheading);

    const heroCta = document.getElementById("hero-cta");
    if (heroCta) {
      heroCta.textContent = content.hero.cta_button_text;
      heroCta.href = content.hero.cta_button_link;
    }
  }
}

function populateAlmasCestQuoi() {
  if (!content.almas_cest_quoi) return;

  setText("almas-cest-quoi-heading", content.almas_cest_quoi.heading);
  setText("almas-cest-quoi-text", content.almas_cest_quoi.text);
  setImage(
    "almas-cest-quoi-img",
    content.almas_cest_quoi.image,
    "Almas c'est quoi"
  );
}

function populateQuiSommesNous() {
  if (!content.qui_sommes_nous) return;

  setText("qui-sommes-nous-heading", content.qui_sommes_nous.heading);
  setText("qui-sommes-nous-text", content.qui_sommes_nous.text);

  const gallery = document.getElementById("qui-sommes-nous-gallery");
  if (gallery) {
    const images = normalizeArray(
      content.qui_sommes_nous.images || content.qui_sommes_nous.image
    );
    gallery.innerHTML = images
      .map((item, index) => {
        const src = typeof item === 'string' ? item : item.src;
        const name = typeof item === 'object' ? item.name : null;

        if (name) {
          return `
            <div class="gallery-item-wrapper">
              <img src="${src}" alt="${name}" loading="lazy" decoding="async">
              <div class="name-label" data-name="${name}">
                <svg class="hand-drawn-line" viewBox="0 0 100 60" preserveAspectRatio="none">
                  <path class="line-path" d="M ${index === 0 ? '80' : index === 1 ? '50' : '20'} 5 Q ${index === 0 ? '65' : index === 1 ? '50' : '35'} 25, 50 55" stroke="#2c1810" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
                <span class="name-text">${name}</span>
              </div>
            </div>
          `;
        }

        return `<img src="${src}" alt="Qui sommes nous ${index + 1}" loading="lazy" decoding="async">`;
      })
      .join("");
  }
}

function populateNotreCafe() {
  if (!content.notre_cafe) return;

  setText("notre-cafe-text", content.notre_cafe.text);

  const cardsContainer = document.getElementById("visit-cards");
  if (cardsContainer && content.notre_cafe.items) {
    const items = normalizeArray(content.notre_cafe.items);
    cardsContainer.innerHTML = items
      .map((item) => {
        const lines = normalizeArray(item.lines)
          .map((line) => `<p>${line}</p>`)
          .join("");
        const isAddress = item.label?.toLowerCase().includes("adresse");

        if (isAddress) {
          return `
            <a href="https://maps.app.goo.gl/wBbG7msv6UKrpCJu5" target="_blank" rel="noopener" class="visit-card visit-card-link">
              <h3>${item.label || ""}</h3>
              ${lines}
            </a>
          `;
        }

        return `
          <div class="visit-card">
            <h3>${item.label || ""}</h3>
            ${lines}
          </div>
        `;
      })
      .join("");
  }
}

function populateMenuPage() {
  if (!content.menu) return;

  setText("menu-heading", content.menu.heading);
  setText("menu-subheading", content.menu.subheading);

  const menuHero = document.querySelector(".menu-hero");
  if (menuHero && content.menu.hero_image) {
    menuHero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${content.menu.hero_image}')`;
  }

  ["coffee", "pastries", "lunch"].forEach((section) => {
    if (!content.menu[section]) return;

    setText(`${section}-section-title`, content.menu[section].section_title);
    setImage(
      `${section}-section-img`,
      content.menu[section].section_image,
      section
    );

    const container = document.getElementById(`${section}-items`);
    if (container) {
      container.innerHTML = content.menu[section].items
        .map((item) => createMenuItem(item))
        .join("");
    }
  });
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
    setText("cafe-tagline", content.footer.tagline);
  }

  const socialLinks = document.getElementById("social-links");
  if (socialLinks && content.social) {
    const platforms = ["facebook", "twitter"];
    socialLinks.innerHTML = platforms
      .filter((platform) => content.social[platform])
      .map(
        (platform) =>
          `<a href="${content.social[platform]}" target="_blank" rel="noopener" aria-label="${platform}">
          <i class="ph ph-${platform}-logo"></i>
        </a>`
      )
      .join("");
  }
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (!element || !text) return;

  if (element.tagName === "H2" && /[\?']/.test(text)) {
    element.innerHTML = text
      .replace(/\?/g, '<span class="fallback-char">?</span>')
      .replace(/'/g, '<span class="fallback-char">\'</span>');
  } else {
    element.textContent = text;
  }
}

function setImage(id, src, alt) {
  const element = document.getElementById(id);
  if (!element || !src) return;

  element.src = src;
  element.loading = "lazy";
  element.decoding = "async";
  if (alt) element.alt = alt;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function cacheDOMElements() {
  domElements = {
    floatingButton: document.getElementById("floating-button"),
    floatingInstagram: document.getElementById("floating-instagram"),
    heroSlideshow: document.querySelector(".hero-slideshow"),
    scrollIndicator: document.querySelector(".scroll-indicator"),
    heroNavButtons: document.querySelectorAll(".hero-nav-buttons"),
    hero: document.querySelector(".hero"),
    sectionContainers: document.querySelectorAll(
      ".almas-cest-quoi-image, .qui-sommes-nous-image"
    ),
  };

  animationState.slides = document.querySelectorAll(".hero-slide");
  animationState.revealElements = document.querySelectorAll(".reveal");
  animationState.heroHeight = domElements.hero
    ? domElements.hero.offsetHeight
    : 0;
}

function initSlideshow() {
  if (animationState.slides.length <= 1) return;

  const nextSlide = () => {
    const currentSlide = animationState.slides[animationState.currentSlide];
    const nextSlideIndex =
      (animationState.currentSlide + 1) % animationState.slides.length;
    const nextSlideElement = animationState.slides[nextSlideIndex];

    // Remove active class from current slide
    currentSlide.classList.remove("active");

    // Reset animation on next slide by temporarily removing and re-adding animation class
    nextSlideElement.style.animation = "none";
    // Force reflow to restart animation
    void nextSlideElement.offsetHeight;
    nextSlideElement.style.animation = "";

    // Add active class to next slide
    nextSlideElement.classList.add("active");

    animationState.currentSlide = nextSlideIndex;
  };

  setInterval(nextSlide, 7000);
}

function initScrollEffects() {
  const containerData = Array.from(domElements.sectionContainers || [])
    .map((container) => {
      const images = container.querySelectorAll("img");
      const isAlmas = container.classList.contains("almas-cest-quoi-image");
      return {
        element: container,
        images: Array.from(images),
        parallaxRange: isAlmas ? 24 : 16,
        isGallery: !isAlmas,
      };
    })
    .filter((data) => data.images.length > 0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    if (domElements.scrollIndicator) {
      domElements.scrollIndicator.style.opacity = scrollY > 50 ? "0" : "1";
    }

    if (domElements.heroNavButtons) {
      domElements.heroNavButtons.forEach(btn => {
        btn.style.opacity = scrollY > 50 ? "0" : "1";
      });
    }

    const triggerPoint = window.innerWidth <= 768 ? 600 : 1000;
    const showButtons = scrollY > triggerPoint;

    if (domElements.floatingButton) {
      domElements.floatingButton.classList.toggle("visible", showButtons);
    }
    if (domElements.floatingInstagram) {
      domElements.floatingInstagram.classList.toggle("visible", showButtons);
    }

    if (domElements.heroSlideshow && scrollY < animationState.heroHeight) {
      const scrollPercent = Math.min(scrollY / animationState.heroHeight, 1);
      const scaleX = 1 - scrollPercent * 0.25;
      const scaleY = 1 - scrollPercent * 0.15;
      const borderRadius = Math.min(scrollPercent / 0.1, 1) * 16;
      const blur = scrollPercent * 20;

      domElements.heroSlideshow.style.transform = `translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`;
      domElements.heroSlideshow.style.borderRadius = `${borderRadius}px`;

      animationState.slides.forEach((slide) => {
        slide.style.filter = `blur(${blur}px)`;
      });
    }

    containerData.forEach((data) => {
      const rect = data.element.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollPast = Math.max(0, windowHeight - rect.top);
        const maxScroll = windowHeight + rect.height;
        const scrollPercent = Math.min(scrollPast / maxScroll, 1);
        const parallaxY = (scrollPercent - 0.5) * data.parallaxRange;

        data.images.forEach((img, index) => {
          const speedMultiplier = data.isGallery
            ? [0.5, 1.0, 1.5][index] || 1
            : 1;
          img.style.setProperty(
            "--parallax-offset",
            `${parallaxY * speedMultiplier}%`
          );
        });
      }
    });

    animationState.revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight * 0.85) {
        element.classList.add("active");
      }
    });

    animationState.ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!animationState.ticking) {
        requestAnimationFrame(handleScroll);
        animationState.ticking = true;
      }
    },
    { passive: true }
  );

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      animationState.heroHeight = domElements.hero
        ? domElements.hero.offsetHeight
        : 0;
    }, 250);
  });

  handleScroll();
}

function animateLogo() {
  const logo = document.querySelector(".hero-logo");
  if (!logo) return;

  const paths = Array.from(logo.querySelectorAll("path"));
  const pathsWithPos = paths
    .map((path) => ({ path, x: path.getBBox().x }))
    .sort((a, b) => a.x - b.x);

  pathsWithPos.forEach((item, index) => {
    const length = item.path.getTotalLength();
    item.path.style.strokeDasharray = length;
    item.path.style.strokeDashoffset = length;

    setTimeout(() => {
      item.path.style.transition = "stroke-dashoffset 1.5s ease-out";
      item.path.style.strokeDashoffset = "0";
    }, index * 250);
  });

  const totalAnimationTime = pathsWithPos.length * 250 + 200;

  setTimeout(() => logo.classList.add("filled"), totalAnimationTime);

  const tagline = document.getElementById("hero-subheading");
  const scrollIndicator = domElements.scrollIndicator;
  const heroNavButtons = domElements.heroNavButtons;

  if (tagline) {
    setTimeout(() => {
      tagline.classList.add("show");
      if (heroNavButtons && heroNavButtons.length > 0) {
        setTimeout(() => {
          heroNavButtons.forEach(btn => btn.classList.add("show"));
          if (scrollIndicator) {
            setTimeout(() => scrollIndicator.classList.add("show"), 200);
          }
        }, 400);
      } else if (scrollIndicator) {
        setTimeout(() => scrollIndicator.classList.add("show"), 400);
      }
    }, totalAnimationTime + 800);
  } else {
    if (heroNavButtons && heroNavButtons.length > 0) {
      setTimeout(() => {
        heroNavButtons.forEach(btn => btn.classList.add("show"));
        if (scrollIndicator) {
          setTimeout(() => scrollIndicator.classList.add("show"), 200);
        }
      }, totalAnimationTime + 1200);
    } else if (scrollIndicator) {
      setTimeout(
        () => scrollIndicator.classList.add("show"),
        totalAnimationTime + 1200
      );
    }
  }
}

function lazyLoadHeroImages() {
  const slides = document.querySelectorAll(".hero-slide[data-bg]");
  const supportsWebP =
    document
      .createElement("canvas")
      .toDataURL("image/webp")
      .indexOf("data:image/webp") === 0;

  slides.forEach((slide) => {
    const webpUrl = slide.getAttribute("data-bg-webp");
    const jpgUrl = slide.getAttribute("data-bg");
    const bgUrl = supportsWebP && webpUrl ? webpUrl : jpgUrl;

    if (bgUrl) {
      const img = new Image();
      img.onload = () => {
        slide.style.backgroundImage = `url('${bgUrl}')`;
      };
      img.src = bgUrl;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cacheDOMElements();
  initSlideshow();
  initScrollEffects();
  animateLogo();
  loadContent();

  // Lazy load hero images 2 and 3 after initial load
  setTimeout(lazyLoadHeroImages, 1000);
});

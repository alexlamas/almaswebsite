let domElements = {};
let animationState = {
  currentSlide: 0,
  slides: [],
  heroHeight: 0,
  ticking: false,
  revealElements: [],
};

function lazyLoadMapbox() {
  const mapContainer = document.getElementById("mapbox-map");
  if (!mapContainer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.disconnect();

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
          mapboxJS.onload = () => {
            // Give CSS time to load before initializing
            setTimeout(initMapbox, 100);
          };
          mapboxJS.onerror = () => {
            console.error("Failed to load Mapbox");
          };
          document.head.appendChild(mapboxJS);
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

  try {

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
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

const INSTAGRAM_PREVIEWS = [
  "/images/insta1.png",
  "/images/insta2.png",
  "/images/insta3.png",
  "/images/insta4.png",
  "/images/insta5.png",
];

function cycleInstagramImages() {
  const img = document.getElementById("instagram-preview-img");
  if (!img) return;

  const images = INSTAGRAM_PREVIEWS;
  let currentIndex = 0;
  const preloadedImages = [];

  // Preload all images and wait for them to load
  const loadPromises = images.map((src, index) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        preloadedImages[index] = image;
        resolve();
      };
      image.onerror = () => resolve(); // Continue even if an image fails to load
      image.src = src;
    });
  });

  // Start cycling only after all images are loaded
  Promise.all(loadPromises).then(() => {
    const container = img.parentElement;

    // Ensure container has position relative
    container.style.position = 'relative';

    function updateImage() {
      const currentImg = document.getElementById('instagram-preview-img');
      if (!currentImg) return;

      const nextIndex = (currentIndex + 1) % images.length;

      // Create new image element for next image
      const nextImg = document.createElement('img');
      nextImg.src = images[nextIndex];
      nextImg.style.width = '100%';
      nextImg.style.height = '100%';
      nextImg.style.objectFit = 'cover';
      nextImg.style.position = 'absolute';
      nextImg.style.top = '0';
      nextImg.style.left = '100%';
      nextImg.style.transition = 'left 0.6s ease-out';

      container.appendChild(nextImg);

      // Force browser to register the initial position
      nextImg.offsetHeight;

      // Slide both images to the left together
      setTimeout(() => {
        currentImg.style.left = '-100%';
        nextImg.style.left = '0';
      }, 10);

      // Clean up after transition
      setTimeout(() => {
        currentImg.remove();
        nextImg.id = 'instagram-preview-img';
        currentIndex = nextIndex;
      }, 650);
    }

    // Make current image ready for sliding
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.transition = 'left 0.6s ease-out';

    // Start cycling every 5 seconds
    setInterval(updateImage, 5000);
  });
}

function animateNameLabels() {
  const galleryItems = document.querySelectorAll('.qui-sommes-nous .gallery-item-wrapper');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        // Animate each item one by one
        galleryItems.forEach((item, index) => {
          const linePath = item.querySelector('.line-path');
          const nameText = item.querySelector('.name-text');

          // Delay each item by 1.2 seconds (800ms line + 400ms gap)
          const itemDelay = index * 1200;

          // Animate line
          setTimeout(() => {
            if (linePath) linePath.classList.add('animate');

            // Then animate text while line is still drawing
            setTimeout(() => {
              if (nameText) nameText.classList.add('show');
            }, 400);
          }, itemDelay + 300);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (galleryItems.length > 0) {
    observer.observe(galleryItems[0]);
  }
}

function cacheDOMElements() {
  domElements = {
    floatingButtonsContainer: document.querySelector(".floating-buttons-container"),
    heroSlideshow: document.querySelector(".hero-slideshow"),
    scrollIndicator: document.querySelector(".scroll-indicator"),
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

    // Move floating buttons to corner after scrolling past hero
    updateFloatingButtonsPosition();

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
      // Update floating buttons immediately for smooth scrolling
      updateFloatingButtonsPosition();

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

  if (tagline) {
    setTimeout(() => {
      tagline.classList.add("show");
      if (scrollIndicator) {
        setTimeout(() => scrollIndicator.classList.add("show"), 400);
      }
      // Start cycling text after tagline is shown
      setTimeout(() => startHeroCyclingText(), 2000);
    }, totalAnimationTime + 800);
  } else if (scrollIndicator) {
    setTimeout(
      () => scrollIndicator.classList.add("show"),
      totalAnimationTime + 1200
    );
  }
}

function startHeroCyclingText() {
  const subheading = document.getElementById("hero-subheading");
  if (!subheading) return;

  const texts = [
    "La cuisine de nos racines",
    "Restaurant & Café",
    "Prestations traiteur",
    "Pains farcis maison",
    "Événements privés",
    "À emporter",
    "Workshops culinaires"
  ];

  let currentIndex = 0;

  // Make it clickable to scroll down
  subheading.style.cursor = "pointer";
  subheading.addEventListener("click", () => {
    const nextSection = document.getElementById("almas-cest-quoi");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  function updateText() {
    const currentSubheading = document.getElementById("hero-subheading");
    if (!currentSubheading) return;

    // Fade out
    currentSubheading.style.opacity = "0";

    setTimeout(() => {
      // Change text
      currentIndex = (currentIndex + 1) % texts.length;
      currentSubheading.textContent = texts[currentIndex];

      // Fade in
      currentSubheading.style.opacity = "1";
    }, 400);
  }

  // Cycle through texts every 3.5 seconds
  setInterval(updateText, 3500);
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

function updateFloatingButtonsPosition() {
  if (!domElements.floatingButtonsContainer) return;
  const container = domElements.floatingButtonsContainer;
  const scrollY = window.scrollY;
  const isMobile = window.innerWidth <= 768;

  const hideAt = 50;
  const showCornerAt = isMobile ? 300 : 400;

  // Three states: visible at bottom, hidden, visible at corner
  const isHidden = scrollY >= hideAt && scrollY < showCornerAt;
  const isCorner = scrollY >= showCornerAt;

  container.classList.toggle('hidden', isHidden);
  container.classList.toggle('corner', isCorner);
}

document.addEventListener("DOMContentLoaded", () => {
  cacheDOMElements();
  initSlideshow();
  initScrollEffects();
  animateLogo();
  animateNameLabels();
  lazyLoadMapbox();
  cycleInstagramImages();
  updateFloatingButtonsPosition();

  // Lazy load hero images 2 and 3 after initial load
  setTimeout(lazyLoadHeroImages, 1000);
});

window.addEventListener("resize", () => {
  updateFloatingButtonsPosition();
});

let content = {};

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

  if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/")
  ) {
    populateHomePage();
    populateAlmasCestQuoi();
    populateQuiSommesNous();
    populateNotreCafe();
  }

  if (window.location.pathname.includes("menu.html")) {
    populateMenuPage();
  }

  populateFooter();
  initMapbox();
}

function initMapbox() {
  setTimeout(function () {
    if (
      typeof mapboxgl !== "undefined" &&
      document.getElementById("mapbox-map")
    ) {
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

      map.addControl(new mapboxgl.NavigationControl());

      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "42px";
      el.style.height = "58px";
      el.style.cursor = "pointer";
      el.style.position = "relative";

      el.innerHTML = `
        <img src="/images/pin.svg"
             style="width: 42px;
                    height: 58px;
                    display: block;"
             alt="Location pin">
        <img src="/favicon/favicon.svg"
             style="position: absolute;
                    top: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 38px;
                    height: 38px;
                    filter: brightness(0) invert(1);"
             alt="ALMAS">
      `;

      el.style.filter = "drop-shadow(0 3px 8px rgba(0,0,0,0.3))";

      // Make the pin clickable to open Google Maps
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        window.open('https://maps.app.goo.gl/Gft9sFEBrsT9h2KG7', '_blank');
      });

      new mapboxgl.Marker(el, { anchor: "bottom" })
        .setLngLat(cafeCoordinates)
        .addTo(map);

      map.on("click", function () {
        map.scrollZoom.enable();
      });

      map.getCanvas().addEventListener("mouseleave", function () {
        map.scrollZoom.disable();
      });
    }
  }, 500);
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
  if (content.almas_cest_quoi) {
    setText("almas-cest-quoi-heading", content.almas_cest_quoi.heading);
    setText("almas-cest-quoi-text", content.almas_cest_quoi.text);
    setImage(
      "almas-cest-quoi-img",
      content.almas_cest_quoi.image,
      "Almas c'est quoi"
    );
  }
}

function populateQuiSommesNous() {
  if (content.qui_sommes_nous) {
    setText("qui-sommes-nous-heading", content.qui_sommes_nous.heading);
    setText("qui-sommes-nous-text", content.qui_sommes_nous.text);

    const gallery = document.getElementById("qui-sommes-nous-gallery");
    if (gallery) {
      gallery.innerHTML = "";
      const images = Array.isArray(content.qui_sommes_nous.images)
        ? content.qui_sommes_nous.images
        : content.qui_sommes_nous.image
        ? [content.qui_sommes_nous.image]
        : [];

      images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Qui sommes nous ${index + 1}`;
        img.loading = "lazy";
        img.decoding = "async";
        gallery.appendChild(img);
      });
    }
  }
}

function populateNotreCafe() {
  if (content.notre_cafe) {
    setText("notre-cafe-text", content.notre_cafe.text);

    const cardsContainer = document.getElementById("visit-cards");
    if (cardsContainer && content.notre_cafe.items) {
      const items = Array.isArray(content.notre_cafe.items)
        ? content.notre_cafe.items
        : [];
      cardsContainer.innerHTML = items
        .map((item) => {
          const lines = Array.isArray(item.lines)
            ? item.lines.map((line) => `<p>${line}</p>`).join("")
            : "";

          // Wrap entire address card in a link
          if (item.label && item.label.toLowerCase().includes('adresse')) {
            return `
              <a href="https://maps.app.goo.gl/Gft9sFEBrsT9h2KG7" target="_blank" rel="noopener" class="visit-card visit-card-link">
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
}

function populateMenuPage() {
  if (content.menu) {
    setText("menu-heading", content.menu.heading);
    setText("menu-subheading", content.menu.subheading);

    const menuHero = document.querySelector(".menu-hero");
    if (menuHero && content.menu.hero_image) {
      menuHero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${content.menu.hero_image}')`;
    }

    if (content.menu.coffee) {
      setText("coffee-section-title", content.menu.coffee.section_title);
      setImage(
        "coffee-section-img",
        content.menu.coffee.section_image,
        "Coffee"
      );

      const coffeeItems = document.getElementById("coffee-items");
      if (coffeeItems) {
        coffeeItems.innerHTML = content.menu.coffee.items
          .map((item) => createMenuItem(item))
          .join("");
      }
    }

    if (content.menu.pastries) {
      setText("pastries-section-title", content.menu.pastries.section_title);
      setImage(
        "pastries-section-img",
        content.menu.pastries.section_image,
        "Pastries"
      );

      const pastriesItems = document.getElementById("pastries-items");
      if (pastriesItems) {
        pastriesItems.innerHTML = content.menu.pastries.items
          .map((item) => createMenuItem(item))
          .join("");
      }
    }

    if (content.menu.lunch) {
      setText("lunch-section-title", content.menu.lunch.section_title);
      setImage("lunch-section-img", content.menu.lunch.section_image, "Lunch");

      const lunchItems = document.getElementById("lunch-items");
      if (lunchItems) {
        lunchItems.innerHTML = content.menu.lunch.items
          .map((item) => createMenuItem(item))
          .join("");
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
    setText("cafe-tagline", content.footer.tagline);
  }

  const socialLinks = document.getElementById("social-links");
  if (socialLinks && content.social) {
    const links = [];
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
    socialLinks.innerHTML = links.join("");
  }
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element && text) {
    if (element.tagName === "H2" && text.match(/[\?']/)) {
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
    if (!element.getAttribute("loading")) {
      element.setAttribute("loading", "lazy");
    }
    element.setAttribute("decoding", "async");
    if (alt) element.alt = alt;
  }
}

let currentSlide = 0;
let slides = [];
let floatingButton = null;
let floatingInstagram = null;
let heroSlideshow = null;

function initSlideshow() {
  slides = document.querySelectorAll(".hero-slide");

  function nextSlide() {
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 7000);
  }
}

function initScrollEffects() {
  floatingButton = document.getElementById("floating-button");
  floatingInstagram = document.getElementById("floating-instagram");
  heroSlideshow = document.querySelector(".hero-slideshow");
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const hero = document.querySelector(".hero");
  const sectionContainers = document.querySelectorAll(
    ".almas-cest-quoi-image, .qui-sommes-nous-image"
  );

  const containerData = Array.from(sectionContainers)
    .map((container) => {
      const images = Array.from(container.querySelectorAll("img"));
      const isGallery = container.classList.contains("qui-sommes-nous-image");
      const isAlmas = container.classList.contains("almas-cest-quoi-image");
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
    .filter((data) => data.images.length > 0);

  let ticking = false;
  let heroHeight = hero ? hero.offsetHeight : 0;

  window.addEventListener("resize", () => {
    heroHeight = hero ? hero.offsetHeight : 0;
  });

  const updateScrollEffects = () => {
    const scrollY = window.scrollY;

    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrollY > 50 ? "0" : "1";
    }

    const triggerPoint = window.innerWidth <= 768 ? 600 : 1000;

    if (floatingButton) {
      if (scrollY > triggerPoint) {
        floatingButton.classList.add("visible");
      } else {
        floatingButton.classList.remove("visible");
      }
    }

    if (floatingInstagram) {
      if (scrollY > triggerPoint) {
        floatingInstagram.classList.add("visible");
      } else {
        floatingInstagram.classList.remove("visible");
      }
    }

    if (heroSlideshow && scrollY < heroHeight) {
      const scrollPercent = Math.min(scrollY / heroHeight, 1);

      const scaleX = 1 - scrollPercent * 0.25;
      const scaleY = 1 - scrollPercent * 0.15;
      const borderRadius = Math.min(scrollPercent / 0.1, 1) * 16;
      const blur = scrollPercent * 20;

      heroSlideshow.style.transform = `translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`;
      heroSlideshow.style.borderRadius = `${borderRadius}px`;

      if (slides.length > 0) {
        slides.forEach((slide) => {
          slide.style.filter = `blur(${blur}px)`;
        });
      }
    }

    const windowHeight = window.innerHeight;
    containerData.forEach((data) => {
      const rect = data.element.getBoundingClientRect();

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollPast = Math.max(0, windowHeight - rect.top);
        const maxScroll = windowHeight + rect.height;
        const scrollPercent = Math.min(scrollPast / maxScroll, 1);
        const parallaxY = (scrollPercent - 0.5) * data.parallaxRange;

        data.images.forEach((img, index) => {
          img.style.removeProperty("transform");
          const speedMultiplier =
            data.isGallery && data.speedMultipliers[index]
              ? data.speedMultipliers[index]
              : 1.0;
          const adjustedParallaxY = parallaxY * speedMultiplier;
          img.style.setProperty("--parallax-offset", `${adjustedParallaxY}%`);
        });
      }
    });

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    },
    { passive: true }
  );
}

const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight * 0.85) {
      element.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

function animateLogo() {
  const logo = document.querySelector(".hero-logo");
  if (!logo) return;

  const paths = logo.querySelectorAll("path");

  const pathsArray = Array.from(paths);
  const pathsWithPos = pathsArray.map((path, originalIndex) => {
    const bbox = path.getBBox();
    return {
      path: path,
      x: bbox.x,
      originalIndex: originalIndex,
    };
  });

  pathsWithPos.sort((a, b) => a.x - b.x);

  pathsWithPos.forEach((item, index) => {
    const path = item.path;
    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    setTimeout(() => {
      path.style.transition = "stroke-dashoffset 1.5s ease-out";
      path.style.strokeDashoffset = "0";
    }, index * 250);
  });

  const totalAnimationTime = pathsWithPos.length * 250 + 200;
  setTimeout(() => {
    logo.classList.add("filled");
  }, totalAnimationTime);

  const tagline = document.getElementById("hero-subheading");
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (tagline) {
    setTimeout(() => {
      tagline.classList.add("show");
      if (scrollIndicator) {
        setTimeout(() => {
          scrollIndicator.classList.add("show");
        }, 400);
      }
    }, totalAnimationTime + 800);
  } else if (scrollIndicator) {
    setTimeout(() => {
      scrollIndicator.classList.add("show");
    }, totalAnimationTime + 1200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSlideshow();
  initScrollEffects();
  animateLogo();
  loadContent();
});
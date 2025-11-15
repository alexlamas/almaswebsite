# CLAUDE.md - AI Assistant Guide for ALMAS Website

**Last Updated:** 2025-11-15
**Repository:** almaswebsite
**Project Type:** Static Restaurant Website
**Philosophy:** Simplicity over complexity

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [File Structure](#file-structure)
4. [Content Management System](#content-management-system)
5. [Development Workflow](#development-workflow)
6. [Code Conventions](#code-conventions)
7. [Design System](#design-system)
8. [Key Features & Implementation](#key-features--implementation)
9. [Common Tasks](#common-tasks)
10. [DO's and DON'Ts](#dos-and-donts)
11. [Git Workflow](#git-workflow)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What is This?

ALMAS is a modern restaurant website built with **intentional simplicity**. This is NOT a typical modern web app - it deliberately avoids frameworks, build tools, and complex dependencies to maximize:

- **Maintainability** - Non-technical users can edit content via YAML
- **Reliability** - No build process means no build failures
- **Simplicity** - Direct file upload for instant updates
- **Performance** - Vanilla JavaScript loads instantly

### Core Philosophy

> "When in doubt, keep it simple. The goal is maintainability, not showcasing the latest tech stack."

**Key Principles:**
- Single YAML file for all content management
- No build process required
- Vanilla JavaScript (no frameworks)
- Static file hosting (Hostinger)
- Mobile-first responsive design
- Performance-optimized (lazy loading, WebP images)

### Project Stats

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~2,256 lines |
| HTML | 329 lines (index.html + menu.html) |
| JavaScript | 552 lines (app.js) |
| CSS | 1,199 lines (style.css) |
| YAML Content | 176 lines (content.yaml) |
| Total Assets | ~12.3 MB |
| Images | ~8.4 MB |
| Favicon/PWA | ~3.7 MB |
| Fonts | ~163 KB |

---

## 🏗️ Architecture & Technology Stack

### Technology Stack

```
Frontend:
├── HTML5 - Semantic, accessible markup
├── CSS3 - Modern features (flexbox, grid, custom properties)
├── Vanilla JavaScript (ES6+) - No frameworks
└── YAML - Human-friendly content format

External Dependencies (CDN):
├── js-yaml@4.1.0 - YAML parsing
├── Mapbox GL JS v3.0.1 - Interactive maps (lazy-loaded)
├── Phosphor Icons v2.1.1 - Icon library
└── Google Fonts - Raleway, Playfair Display

No Local Dependencies:
✗ No npm/node_modules
✗ No webpack/bundler
✗ No React/Vue/Angular
✗ No preprocessors (Sass/Less)
✗ No testing frameworks
```

### Application Flow

```
USER BROWSER
    ↓
┌─────────────────────────────────┐
│ index.html / menu.html          │
├─────────────────────────────────┤
│ Loads in parallel:              │
│ • style.css (all styling)       │
│ • app.js (all logic)            │
│ • Google Fonts (typography)     │
│ • Phosphor Icons (UI icons)     │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ DOMContentLoaded Event          │
├─────────────────────────────────┤
│ 1. cacheDOMElements()           │ ← Cache DOM references
│ 2. initSlideshow()              │ ← Start 7-second rotation
│ 3. initScrollEffects()          │ ← Setup parallax & reveal
│ 4. animateLogo()                │ ← Animate SVG logo
│ 5. loadContent()                │ ← Fetch content.yaml
│    ↓                             │
│    fetch('content.yaml')        │
│    ↓                             │
│    jsyaml.load()                │ ← Parse YAML
│    ↓                             │
│    populateContent()            │
│    ├─ populateHomePage()        │
│    │  ├─ Hero section           │
│    │  ├─ Almas section          │
│    │  ├─ Team gallery           │
│    │  ├─ Map/address            │
│    │  └─ Footer                 │
│    └─ populateMenuPage()        │
│       ├─ Coffee section         │
│       ├─ Pastries section       │
│       └─ Lunch section          │
└─────────────────────────────────┘
```

### Performance Optimizations

**Critical Performance Patterns:**
```javascript
// 1. Request Animation Frame for scroll handling
animationState.ticking = true;
requestAnimationFrame(handleScroll);

// 2. Intersection Observer for lazy loading
new IntersectionObserver((entries) => {
  if (entry.isIntersecting) { loadResource(); }
}, { rootMargin: '200px' });

// 3. Passive event listeners
window.addEventListener('scroll', handler, { passive: true });

// 4. Debounced resize handler
clearTimeout(resizeTimeout);
resizeTimeout = setTimeout(() => { recalculate(); }, 250);

// 5. WebP with JPEG fallback
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" loading="lazy" decoding="async">
</picture>
```

---

## 📁 File Structure

### Directory Tree

```
almaswebsite/
├── Core Application Files
│   ├── index.html (229 lines)      # Homepage
│   ├── menu.html (100 lines)       # Menu page
│   ├── app.js (552 lines)          # All JavaScript logic
│   ├── style.css (1199 lines)      # All styling
│   └── content.yaml (176 lines)    # ⭐ SINGLE SOURCE OF TRUTH
│
├── Development Tools
│   ├── start-server.sh             # Local Python server launcher
│   ├── font-test.html              # Font rendering tests
│   └── name-label-test.html        # Name label styling tests
│
├── Documentation
│   ├── README.md (358 lines)       # User-facing documentation
│   └── CLAUDE.md (this file)       # AI assistant guide
│
└── Assets
    ├── images/ (8.4MB)
    │   ├── hero-1.jpg, hero-2.jpg, hero-3.jpg  # Slideshow
    │   ├── hero-1.webp, hero-2.webp, hero-3.webp
    │   ├── farcis.jpg, farcis.webp  # Content images
    │   ├── almas.jpg
    │   ├── qui-sommes-nous-1.png    # Team photos
    │   ├── qui-sommes-nous-2.png
    │   ├── qui-sommes-nous-3.png
    │   ├── logo-black.svg           # Logo (stroke-animated)
    │   └── pin.svg                  # Map marker
    │
    ├── fonts/ (163KB)
    │   └── sugarmagic.otf           # Decorative font for name labels
    │
    └── favicon/ (3.7MB)
        ├── favicon.svg, favicon.ico
        ├── favicon-96x96.png
        ├── apple-touch-icon.png
        ├── site.webmanifest          # PWA manifest
        ├── web-app-manifest-192x192.png
        └── web-app-manifest-512x512.png
```

### File Purposes

| File | Purpose | Lines | Modify When... |
|------|---------|-------|----------------|
| **content.yaml** | All editable content | 176 | Changing ANY text, images, menu items, contact info |
| **app.js** | Application logic | 552 | Adding features, changing behavior, new animations |
| **style.css** | All styling | 1199 | Changing design, colors, layout, responsiveness |
| **index.html** | Homepage structure | 229 | Changing page structure, adding sections |
| **menu.html** | Menu page structure | 100 | Changing menu page layout |

---

## 📝 Content Management System

### The YAML Philosophy

**All editable content lives in `content.yaml`**. This is the SINGLE SOURCE OF TRUTH.

### YAML Structure

```yaml
# Site-wide settings
site:
  name: "ALMAS"
  tagline: "La cuisine de nos racines"
  logo: "/images/logo-black.svg"
  favicon: "/favicon/favicon.svg"

# Navigation menu
navigation:
  - label: "Accueil"
    url: "index.html"
  - label: "Menu"
    url: "menu.html"
  # ... more items

# Hero section (homepage)
hero:
  heading: "ALMAS"
  subheading: "La cuisine de nos racines"
  cta_primary:
    text: "Voir le menu"
    url: "menu.html"
  cta_secondary:
    text: "Nous contacter"
    url: "#contact"

# "What is Almas" section
almas_cest_quoi:
  section_title: "Almas, c'est quoi ?"
  text: "Long description text..."
  image: "/images/farcis.jpg"

# Team section with photos
qui_sommes_nous:
  section_title: "Qui sommes-nous ?"
  intro_text: "Meet our team..."
  team_members:
    - name: "Lara"
      photo: "/images/qui-sommes-nous-1.png"
    - name: "Sandra"
      photo: "/images/qui-sommes-nous-2.png"
    - name: "Lama"
      photo: "/images/qui-sommes-nous-3.png"

# Location & contact
notre_cafe:
  section_title: "Notre café"
  info_cards:
    - label: "Horaires"
      value: "Lun-Ven 8h-18h"
    - label: "Adresse"
      value: "123 Rue Example, Paris"
      link: "https://maps.google.com/?q=..."
  map:
    center: [2.36325, 48.87556]  # [longitude, latitude]
    zoom: 15

# Social media links
social:
  instagram: "https://instagram.com/almas.paris"
  facebook: "https://facebook.com/almas"
  twitter: "https://twitter.com/almas"

# Menu management
menu:
  coffee:
    section_title: "Les Cafés"
    items:
      - name: "Espresso"
        price: "2.50€"
      - name: "Cappuccino"
        price: "4.00€"
        description: "Optional description"

  pastries:
    section_title: "Pâtisseries"
    items:
      - name: "Croissant"
        price: "3.00€"
        description: "Butter croissant"

  lunch:
    section_title: "Le Déjeuner"
    items:
      - name: "Salade César"
        price: "12.00€"
        description: "Fresh Caesar salad"

# Footer
footer:
  tagline: "ALMAS - La cuisine de nos racines"
  copyright: "© 2024 ALMAS. Tous droits réservés."
```

### Content Update Workflow

**For text changes:**
1. Open `content.yaml` in any text editor
2. Find the section (use Ctrl+F to search)
3. Edit the text
4. Save the file
5. Upload to server (or refresh locally)

**For image changes:**
1. Add new image to `/images/` folder
2. Update image path in `content.yaml`
3. Upload BOTH the image AND `content.yaml`

**For menu updates:**
1. Edit the `menu` section in `content.yaml`
2. Add/remove/edit items in `coffee`, `pastries`, or `lunch`
3. Save and upload `content.yaml`

### Content Population Functions (app.js)

```javascript
// Homepage sections
populateHomePage()          // Hero: heading, subheading, CTAs
populateAlmasCestQuoi()     // "What is Almas" section
populateQuiSommesNous()     // Team gallery with name labels
populateNotreCafe()         // Location, hours, map
populateFooter()            // Footer text and social links

// Menu page
populateMenuPage()          // Coffee, pastries, lunch sections

// Utilities
setText(id, text)           // Set text with fallback character handling
setImage(id, src, alt)      // Set image with lazy loading
normalizeArray(val)         // Convert single value to array
```

---

## 🔧 Development Workflow

### Local Development Setup

**Start Local Server:**
```bash
# Option 1: Use included script
./start-server.sh

# Option 2: Python directly
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

**Why Local Server Required:**
- YAML fetching needs HTTP/HTTPS (CORS restrictions)
- Google Fonts require proper origin headers
- Mapbox API requires valid protocol

### Making Changes

#### Content Changes
```bash
# 1. Edit content
nano content.yaml

# 2. Test locally
./start-server.sh
# Visit http://localhost:8000

# 3. Upload to production
# Upload only content.yaml via FTP/File Manager
```

#### Styling Changes
```bash
# 1. Edit CSS
nano style.css

# 2. Test locally
./start-server.sh

# 3. Upload to production
# Upload style.css
# Users may need to clear cache (Ctrl+Shift+R)
```

#### JavaScript Changes
```bash
# 1. Edit app.js
nano app.js

# 2. Test locally
./start-server.sh

# 3. Check browser console for errors

# 4. Upload to production
# Upload app.js
```

### Deployment to Hostinger

**Initial Upload:**
1. Login to Hostinger File Manager or FTP
2. Navigate to `public_html`
3. Upload entire directory structure maintaining paths

**Content Updates:**
- Edit `content.yaml` locally
- Upload ONLY `content.yaml` via FTP
- Changes appear immediately

**Image Updates:**
- Add image to `/images/` folder
- Update `content.yaml` with path
- Upload image AND `content.yaml`

**Design Updates:**
- Edit `style.css` or `app.js`
- Upload modified files
- Users clear cache (Ctrl+Shift+R)

---

## 📐 Code Conventions

### Naming Conventions

**CSS Classes:**
```css
/* Kebab-case for class names */
.hero-slideshow
.almas-cest-quoi
.floating-button

/* BEM-like modifiers */
.hero-slide.active
.floating-button.visible

/* State classes */
.show
.active
.reveal
```

**JavaScript Variables:**
```javascript
// camelCase for variables and functions
let animationState = {};
let domElements = {};

// Boolean prefixes
let ticking = false;
let isHomePage = true;

// Collection suffix 's'
const slides = [];
const revealElements = [];

// Function names are descriptive verbs
function populateContent() {}
function initSlideshow() {}
function lazyLoadMapbox() {}
```

**HTML IDs:**
```html
<!-- Kebab-case, descriptive -->
<div id="site-title"></div>
<h1 id="hero-heading"></h1>

<!-- Pattern: {section}-{element} -->
<div id="almas-cest-quoi-heading"></div>
<img id="almas-cest-quoi-image" />
```

**YAML Keys:**
```yaml
# snake_case for YAML keys
almas_cest_quoi:
qui_sommes_nous:
notre_cafe:
section_title:
cta_primary:
```

### CSS Architecture

**File Organization (style.css):**
```css
/* 1. Global Reset & Fonts (lines 1-40) */
* { margin: 0; padding: 0; box-sizing: border-box; }
@font-face { ... }
:root { /* CSS Variables */ }

/* 2. Layout Components (lines 42-500) */
.floating-button { position: fixed; ... }
.hero-slideshow { height: 100vh; ... }
nav { ... }

/* 3. Feature-Specific Styles (lines 500-1199) */
/* Hero slideshow animations */
/* Parallax effects */
/* Name labels */
/* Mapbox customization */
/* Footer */
```

**CSS Custom Properties (Variables):**
```css
:root {
  /* Colors */
  --primary-color: #000000;      /* Black */
  --bg-light: #f5f1e8;           /* Cream */
  --text-dark: #000000;
  --text-light: #f5f1e8;
  --green: #5F9471;              /* Sage green */

  /* Effects */
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;

  /* Layout */
  --max-width: 1200px;
  --section-padding: 4rem 2rem;
}
```

### JavaScript Patterns

**Performance Pattern:**
```javascript
// ✅ GOOD: RequestAnimationFrame for scroll
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ❌ BAD: Direct scroll handler
window.addEventListener('scroll', () => {
  // Runs every pixel scrolled - performance issue
  handleScroll();
});
```

**Lazy Loading Pattern:**
```javascript
// ✅ GOOD: Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadResource();
      observer.disconnect();
    }
  });
}, { rootMargin: '200px' });
observer.observe(element);

// ❌ BAD: Immediate loading
loadResource(); // Loads even if user never scrolls there
```

**Content Population Pattern:**
```javascript
// ✅ GOOD: Guard clauses and safe access
function populateSection() {
  if (!content.sectionKey) return;

  setText('element-id', content.sectionKey.text);
  setImage('img-id', content.sectionKey.image, 'alt text');

  const items = normalizeArray(content.sectionKey.items);
  container.innerHTML = items.map(item =>
    `<div>${item.name}</div>`
  ).join('');
}

// ❌ BAD: No error handling
function populateSection() {
  document.getElementById('element-id').textContent =
    content.sectionKey.text; // Crashes if missing
}
```

---

## 🎨 Design System

### Visual Style

**Philosophy:** Modern, bold, flat aesthetic with clean edges and subtle depth hints

**Characteristics:**
- Monochrome contrast (pure black + warm cream)
- Bold, large, confident typography
- Minimal shadows (inset only for depth)
- Sage green accents for CTAs and highlights

### Color Palette

```css
/* Primary Colors */
--primary-color: #000000;    /* Black - text & primary elements */
--bg-light: #f5f1e8;         /* Cream - backgrounds */
--green: #5F9471;            /* Sage green - accents & buttons */

/* Text Colors */
--text-dark: #000000;        /* Black text on light backgrounds */
--text-light: #f5f1e8;       /* Cream text on dark backgrounds */

/* Usage Examples */
background-color: var(--bg-light);
color: var(--text-dark);
button { background: var(--green); }
```

### Typography

```css
/* Primary Font: Raleway */
font-family: 'Raleway', sans-serif;
font-weight: 600;           /* Bold for navigation */
font-size: 1.1rem;          /* Large, confident text */

/* Secondary Font: Playfair Display */
font-family: 'Playfair Display', serif;
/* Used for elegant headings */

/* Decorative Font: SugarMagic */
font-family: 'SugarMagic', cursive;
/* Used for hand-drawn name labels */
```

### Layout Patterns

**Sections:**
```css
section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  section { padding: 2rem 1rem; }
}
```

**Grid Layouts:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

### Animations

**Ken Burns Slideshow:**
```css
@keyframes panRight {
  0% { transform: scale(1.1) translateX(-2%); }
  100% { transform: scale(1.1) translateX(2%); }
}

@keyframes panLeft {
  0% { transform: scale(1.1) translateX(2%); }
  100% { transform: scale(1.1) translateX(-2%); }
}

.hero-slide {
  animation: panRight 21s ease-in-out infinite alternate;
}
```

**Scroll Reveal:**
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.show {
  opacity: 1;
  transform: translateY(0);
}
```

### Scroll Effects

1. **Hero Shrink Effect**
   - Slideshow scales from 100% to 85% on scroll
   - Gains rounded corners (16px border-radius)
   - 4px border appears

2. **Parallax Motion**
   - Different images move at different speeds (0.5x, 1.0x, 1.5x)
   - Applied via CSS variables and scroll position

3. **Reveal Animations**
   - Sections fade in when 85% visible
   - Smooth opacity + translateY transitions

---

## 🚀 Key Features & Implementation

### 1. Hero Slideshow

**Location:** `index.html` lines 25-35, `app.js` lines 180-200

**Implementation:**
```javascript
function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 7000); // 7-second rotation
}
```

**CSS:**
```css
.hero-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  animation: panRight 21s ease-in-out infinite alternate;
}

.hero-slide.active {
  opacity: 1;
}
```

**To Change Images:**
1. Edit inline styles in `index.html`:
```html
<div class="hero-slide active"
     style="background-image: url('/images/hero-1.webp');">
</div>
```

### 2. Scroll Effects

**Location:** `app.js` lines 250-350

**Hero Shrink Effect:**
```javascript
function handleScroll() {
  const scrollY = window.scrollY;
  const heroHeight = document.querySelector('.hero-slideshow').offsetHeight;
  const scrollPercent = Math.min(scrollY / heroHeight, 1);

  // Scale from 100% to 85%
  const scale = 1 - (scrollPercent * 0.15);

  // Border radius from 0 to 16px
  const borderRadius = scrollPercent * 16;

  document.querySelector('.hero-slideshow').style.transform =
    `scale(${scale})`;
  document.querySelector('.hero-slideshow').style.borderRadius =
    `${borderRadius}px`;
}
```

**Parallax Effect:**
```javascript
function applyParallax() {
  const images = document.querySelectorAll('[data-parallax]');

  images.forEach((img) => {
    const speed = parseFloat(img.dataset.parallax || 1);
    const rect = img.getBoundingClientRect();
    const offset = (window.scrollY - rect.top) * speed * 0.5;

    img.style.setProperty('--parallax-offset', `${offset}px`);
  });
}
```

### 3. Mapbox Integration

**Location:** `app.js` lines 400-480

**Lazy Loading:**
```javascript
function lazyLoadMapbox() {
  const mapContainer = document.getElementById('map');

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMapboxScripts().then(() => initMapbox());
      observer.disconnect();
    }
  }, { rootMargin: '200px' });

  observer.observe(mapContainer);
}
```

**Custom Marker:**
```javascript
function initMapbox() {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: content.notre_cafe.map.center,
    zoom: content.notre_cafe.map.zoom
  });

  // Custom marker with logo
  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker';
  markerEl.innerHTML = `
    <img src="${content.site.logo}" alt="ALMAS" />
  `;

  new mapboxgl.Marker(markerEl)
    .setLngLat(content.notre_cafe.map.center)
    .addTo(map);
}
```

### 4. Team Name Labels

**Location:** `app.js` lines 320-380, `style.css` lines 800-900

**Implementation:**
```javascript
function populateQuiSommesNous() {
  const teamMembers = normalizeArray(content.qui_sommes_nous.team_members);

  const html = teamMembers.map((member, index) => `
    <div class="team-member">
      <img src="${member.photo}" alt="${member.name}" />
      <div class="name-label">
        <svg class="name-line">
          <path d="M 0,30 Q 50,10 100,30"
                stroke="var(--green)"
                fill="none"
                stroke-width="2" />
        </svg>
        <span class="name-text">${member.name}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}
```

**CSS:**
```css
.name-label {
  position: relative;
  margin-top: 1rem;
}

.name-text {
  font-family: 'SugarMagic', cursive;
  font-size: 1.5rem;
  color: var(--green);
  transform: rotate(-2deg);
}

.name-line path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 1s ease forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}
```

### 5. Menu System

**Location:** `menu.html`, `app.js` lines 450-520

**Dynamic Rendering:**
```javascript
function populateMenuPage() {
  ['coffee', 'pastries', 'lunch'].forEach((section) => {
    const sectionData = content.menu[section];
    const container = document.getElementById(`${section}-items`);

    const html = normalizeArray(sectionData.items).map((item) => `
      <div class="menu-item">
        <div class="menu-item-header">
          <h3 class="menu-item-name">${item.name}</h3>
          <span class="menu-item-price">${item.price}</span>
        </div>
        ${item.description ?
          `<p class="menu-item-description">${item.description}</p>`
          : ''}
      </div>
    `).join('');

    container.innerHTML = html;
  });
}
```

---

## ✅ Common Tasks

### Task 1: Update Text Content

**Example: Change hero heading**

1. Open `content.yaml`
2. Find the `hero` section:
```yaml
hero:
  heading: "ALMAS"  # ← Edit this
  subheading: "La cuisine de nos racines"
```
3. Save and upload `content.yaml`

### Task 2: Add New Menu Item

**Example: Add a new coffee**

1. Open `content.yaml`
2. Find `menu.coffee.items`
3. Add new item:
```yaml
menu:
  coffee:
    items:
      - name: "Espresso"
        price: "2.50€"
      - name: "Latte"  # ← New item
        price: "4.50€"
        description: "Creamy espresso with steamed milk"
```
4. Save and upload `content.yaml`

### Task 3: Change Colors

**Example: Change accent color from green to blue**

1. Open `style.css`
2. Find `:root` section:
```css
:root {
  --green: #5F9471;  /* Change to #4A90E2 for blue */
}
```
3. Save and upload `style.css`
4. Users clear cache (Ctrl+Shift+R)

### Task 4: Add New Section to Homepage

**Step 1: Add HTML structure**

Edit `index.html`:
```html
<section class="new-section reveal">
  <div class="container">
    <h2 id="new-section-title"></h2>
    <p id="new-section-text"></p>
    <img id="new-section-image" />
  </div>
</section>
```

**Step 2: Add content to YAML**

Edit `content.yaml`:
```yaml
new_section:
  title: "New Section Title"
  text: "Section description..."
  image: "/images/new-section.jpg"
```

**Step 3: Add populate function**

Edit `app.js`:
```javascript
function populateNewSection() {
  if (!content.new_section) return;

  setText('new-section-title', content.new_section.title);
  setText('new-section-text', content.new_section.text);
  setImage('new-section-image', content.new_section.image,
           content.new_section.title);
}

// Call in populateContent()
function populateContent() {
  // ... existing code
  populateNewSection();
}
```

**Step 4: Add styles**

Edit `style.css`:
```css
.new-section {
  padding: 4rem 2rem;
  background: var(--bg-light);
}

.new-section img {
  max-width: 100%;
  border-radius: 8px;
}
```

### Task 5: Change Hero Slideshow Images

**Method 1: Edit HTML (image URLs)**

Edit `index.html`:
```html
<div class="hero-slide active"
     style="background-image: url('/images/new-hero-1.jpg');">
</div>
```

**Method 2: Upload new images**

1. Optimize images (TinyPNG, under 300KB each)
2. Name consistently: `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`
3. Upload to `/images/` folder
4. Update URLs in `index.html` if filenames changed

### Task 6: Update Contact Information

1. Open `content.yaml`
2. Find `notre_cafe.info_cards`:
```yaml
notre_cafe:
  info_cards:
    - label: "Horaires"
      value: "Lun-Ven 8h-18h"  # ← Edit this
    - label: "Adresse"
      value: "123 Rue Example"  # ← Edit this
      link: "https://maps.google.com/?q=..."  # ← Edit this
```
3. Save and upload `content.yaml`

### Task 7: Add Social Media Link

1. Open `content.yaml`
2. Add to `social` section:
```yaml
social:
  instagram: "https://instagram.com/almas.paris"
  facebook: "https://facebook.com/almas"
  tiktok: "https://tiktok.com/@almas"  # ← New link
```

3. Edit `app.js` to add icon (if needed):
```javascript
function populateFooter() {
  const socialLinks = {
    instagram: '<i class="ph-instagram-logo"></i>',
    facebook: '<i class="ph-facebook-logo"></i>',
    tiktok: '<i class="ph-tiktok-logo"></i>'  // ← Add icon
  };
  // ... rest of function
}
```

---

## ✅ DO's and ❌ DON'Ts

### ✅ DO

**Architecture:**
- ✅ Maintain the single YAML file approach
- ✅ Keep vanilla JavaScript (no frameworks)
- ✅ Use CSS custom properties for theming
- ✅ Test with local server before uploading
- ✅ Optimize images before committing (<300KB)

**Design:**
- ✅ Preserve the flat, modern aesthetic
- ✅ Keep navigation bold and prominent (font-weight: 600)
- ✅ Use inset shadows only for subtle depth
- ✅ Maintain mobile responsiveness
- ✅ Keep animations smooth and purposeful

**Performance:**
- ✅ Use lazy loading for images (`loading="lazy"`)
- ✅ Use WebP with JPEG fallback
- ✅ Keep hero images optimized
- ✅ Use `requestAnimationFrame` for scroll handlers
- ✅ Use Intersection Observer for lazy loading

**Content:**
- ✅ Edit content in `content.yaml` only
- ✅ Use descriptive variable names
- ✅ Add guard clauses in populate functions
- ✅ Handle missing content gracefully

### ❌ DON'T

**Architecture:**
- ❌ Add build tools (webpack, npm scripts, gulp, etc.)
- ❌ Introduce frameworks (React, Vue, Angular, etc.)
- ❌ Add complex dependencies (lodash, jQuery, etc.)
- ❌ Break the YAML structure (maintain backwards compatibility)
- ❌ Hardcode content in HTML (except hero slide URLs)

**Design:**
- ❌ Add heavy drop shadows or glow effects
- ❌ Use overly decorative fonts for body text
- ❌ Break mobile responsiveness
- ❌ Add distracting animations
- ❌ Change the core color palette without discussion

**Performance:**
- ❌ Add large, unoptimized images (>500KB)
- ❌ Add heavy JavaScript libraries
- ❌ Block the main thread with expensive operations
- ❌ Use synchronous XMLHttpRequest
- ❌ Add too many scroll listeners

**Code Quality:**
- ❌ Remove error handling
- ❌ Use `var` instead of `const`/`let`
- ❌ Ignore browser console warnings
- ❌ Skip testing on mobile devices

---

## 🔀 Git Workflow

### Branch Strategy

**Development Branch:** `claude/claude-md-mi0t9xvycjvoocuy-01HaFBtxF1uRGYe77AFRpKph`

**Important Notes:**
- All development happens on the designated Claude branch
- Branch names must start with `claude/` and end with session ID
- Never push to different branches without permission

### Git Operations

**Before Starting Work:**
```bash
# Ensure you're on the correct branch
git status
git branch

# If branch doesn't exist locally
git checkout -b claude/claude-md-mi0t9xvycjvoocuy-01HaFBtxF1uRGYe77AFRpKph
```

**Committing Changes:**
```bash
# Check status
git status

# Add files
git add content.yaml
git add style.css

# Commit with descriptive message
git commit -m "$(cat <<'EOF'
Update menu items and pricing

- Added new coffee items to menu
- Updated pricing for pastries section
- Fixed typo in lunch descriptions
EOF
)"
```

**Pushing Changes:**
```bash
# Push with -u flag to set upstream
git push -u origin claude/claude-md-mi0t9xvycjvoocuy-01HaFBtxF1uRGYe77AFRpKph

# If network errors occur, retry with exponential backoff
# Wait 2s, 4s, 8s, 16s between retries (max 4 retries)
```

**Retry Logic for Network Errors:**
```bash
# Retry push on network failure
for i in 1 2 4 8; do
  git push -u origin claude/claude-md-mi0t9xvycjvoocuy-01HaFBtxF1uRGYe77AFRpKph && break
  echo "Retry in ${i}s..."
  sleep $i
done
```

### Commit Message Guidelines

**Format:**
```
Brief summary of changes (50 chars max)

- Detailed bullet point 1
- Detailed bullet point 2
- Why these changes were made

Fixes #issue-number (if applicable)
```

**Good Examples:**
```
Update menu pricing and add new items

- Added 3 new coffee items to menu.coffee.items
- Updated pricing across all pastries
- Fixed description formatting in lunch section

Reason: Menu update requested for winter season
```

```
Optimize hero slideshow images

- Converted hero images to WebP format
- Reduced file sizes from 800KB to 250KB each
- Added JPEG fallbacks for older browsers

Improves first contentful paint by ~2 seconds
```

**Bad Examples:**
```
Updates
```
(Too vague)

```
Changed content.yaml and style.css and app.js and fixed some bugs
```
(Not descriptive, unclear what was done)

### Pull Request Creation

**Not applicable for this workflow** - Development happens on Claude branches and is reviewed before merging to main.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. YAML Changes Not Showing

**Symptoms:**
- Content updates don't appear on site
- Old content still showing after upload

**Solutions:**
```bash
# Check YAML syntax
# Visit: https://www.yamllint.com/
# Paste content.yaml and check for errors

# Common YAML errors:
# - Incorrect indentation (use 2 spaces, not tabs)
# - Missing colons
# - Unquoted special characters (: ? - @ #)
```

**Browser Cache:**
```javascript
// Hard refresh in browser
// Windows/Linux: Ctrl + Shift + R
// Mac: Cmd + Shift + R
```

**Server Check:**
```bash
# Verify file uploaded
curl https://yoursite.com/content.yaml

# Check file modification time
ls -la content.yaml
```

#### 2. Hero Images Not Updating

**Symptoms:**
- New hero images don't appear
- Old images still showing

**Solutions:**
```html
<!-- Check inline style URLs in index.html -->
<div class="hero-slide active"
     style="background-image: url('/images/hero-1.jpg');">
     <!-- ↑ Ensure this path is correct -->
</div>
```

**Verify Files:**
```bash
# Check image exists
ls -la images/hero-1.jpg

# Check file size (should be < 500KB)
du -h images/hero-1.jpg

# Check case sensitivity (especially on Linux hosting)
# hero-1.jpg ≠ Hero-1.jpg ≠ HERO-1.JPG
```

#### 3. Sections Not Revealing (Scroll Animation)

**Symptoms:**
- Sections don't fade in when scrolling
- Elements stay invisible

**Check JavaScript:**
```javascript
// Open browser console (F12)
// Look for errors

// Common issues:
// 1. Missing 'reveal' class on section
<section class="reveal">  <!-- ← Must have this class -->

// 2. JavaScript not loaded
// Check Network tab in DevTools

// 3. Scroll listener not working
// Add debug log:
function handleScroll() {
  console.log('Scroll event triggered');
  // ... rest of function
}
```

#### 4. Mobile Layout Broken

**Symptoms:**
- Text too small on mobile
- Images overflow
- Buttons too close together

**Check Viewport:**
```html
<!-- Ensure viewport meta tag in <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Test Responsive Breakpoints:**
```css
/* Mobile-first approach */
/* Base styles for mobile (320px+) */

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

**Debug on Device:**
```bash
# Test on actual device, not just DevTools
# Use Chrome Remote Debugging:
# chrome://inspect on desktop
# Enable USB debugging on Android device
```

#### 5. Mapbox Not Loading

**Symptoms:**
- Map container blank
- Console error about Mapbox

**Check API Key:**
```javascript
// In app.js, verify Mapbox token is set
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
```

**Check Coordinates:**
```yaml
# In content.yaml, verify format
notre_cafe:
  map:
    center: [2.36325, 48.87556]  # [longitude, latitude]
    zoom: 15
```

**Network Check:**
```javascript
// Open browser console
// Network tab → Filter: mapbox
// Check if Mapbox scripts loaded successfully
```

#### 6. Font Not Loading

**SugarMagic Font:**
```css
/* Check font-face declaration in style.css */
@font-face {
  font-family: 'SugarMagic';
  src: url('/fonts/sugarmagic.otf') format('opentype');
}

/* Verify file path */
ls -la fonts/sugarmagic.otf
```

**Google Fonts:**
```html
<!-- Check link in <head> of HTML -->
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 📚 Additional Resources

### File References (Quick Access)

| Task | File | Line Range |
|------|------|------------|
| Hero slideshow logic | app.js | 180-200 |
| Scroll effects | app.js | 250-350 |
| Mapbox integration | app.js | 400-480 |
| Menu population | app.js | 450-520 |
| Hero HTML structure | index.html | 25-80 |
| Menu HTML structure | menu.html | 40-95 |
| Color variables | style.css | 10-30 |
| Hero slideshow CSS | style.css | 100-250 |
| Scroll animations | style.css | 600-700 |
| Name labels CSS | style.css | 800-900 |

### External Documentation

- **YAML Syntax:** https://yaml.org/spec/1.2/spec.html
- **Mapbox GL JS:** https://docs.mapbox.com/mapbox-gl-js/api/
- **Phosphor Icons:** https://phosphoricons.com/
- **CSS Custom Properties:** https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- **Intersection Observer:** https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

### Key Patterns Reference

**requestAnimationFrame Pattern:**
```javascript
let ticking = false;

function handleEvent() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      doWork();
      ticking = false;
    });
    ticking = true;
  }
}
```

**Intersection Observer Pattern:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.85,
  rootMargin: '0px'
});

elements.forEach(el => observer.observe(el));
```

**Safe Content Access Pattern:**
```javascript
function populateSection() {
  if (!content.section) {
    console.warn('Section data missing');
    return;
  }

  const items = normalizeArray(content.section.items);
  // ... rest of logic
}
```

---

## 🎓 Philosophy & Best Practices Summary

### Core Values

1. **Simplicity First**
   - No build process = no build failures
   - Vanilla JavaScript = no framework updates
   - Single YAML file = easy content management
   - Direct uploads = instant propagation

2. **Performance Matters**
   - Lazy load everything possible
   - Optimize images ruthlessly (<300KB each)
   - Use modern formats (WebP) with fallbacks
   - Debounce/throttle event handlers

3. **Maintainability Always**
   - Non-technical users can edit content
   - Clear, descriptive naming
   - Guard clauses for missing data
   - Comprehensive error handling

4. **Mobile-First Design**
   - Test on actual devices
   - Touch-friendly tap targets (44px minimum)
   - Responsive breakpoints at 768px, 1024px
   - Performance budget for 3G networks

### When Making Changes

**Ask Yourself:**
1. Does this maintain simplicity?
2. Will a non-technical user understand this?
3. Did I test on mobile?
4. Are images optimized?
5. Is this backwards compatible?
6. Did I handle errors gracefully?

**Before Committing:**
1. Test locally with `./start-server.sh`
2. Check browser console for errors
3. Test on mobile device (or DevTools)
4. Verify YAML syntax
5. Optimize any new images
6. Write descriptive commit message

---

## 🆘 Getting Help

### Debugging Workflow

1. **Check Browser Console (F12)**
   - Look for JavaScript errors
   - Check Network tab for failed requests
   - Verify YAML loaded correctly

2. **Validate YAML**
   - Use https://www.yamllint.com/
   - Check indentation (2 spaces, no tabs)
   - Verify colons and quotes

3. **Check File Paths**
   - Verify case sensitivity
   - Ensure paths start with `/`
   - Check files exist in correct location

4. **Test Locally**
   - Run `./start-server.sh`
   - Test all functionality
   - Check mobile view

5. **Review Git History**
   - Compare with working version
   - Check recent changes
   - Use `git diff` to see modifications

### Contact & Support

- **README.md** - User-facing documentation
- **This file (CLAUDE.md)** - AI assistant guide
- **Browser DevTools** - Real-time debugging
- **Git History** - See what changed when

---

**Remember:** This architecture is intentional. The goal is maintainability and simplicity, not showcasing the latest tech stack. When in doubt, keep it simple.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Maintained By:** Claude AI Assistant

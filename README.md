# ALMAS - Restaurant Website

A modern, custom-built website for ALMAS restaurant featuring a clean, minimal architecture designed for easy content management without complex build tools.

## 🎯 Project Philosophy

This website was intentionally built with **simplicity and maintainability** in mind:

- **No build process** - Direct HTML/CSS/JS that works immediately
- **No frameworks** - Pure vanilla JavaScript for maximum simplicity
- **No dependencies** - No runtime libraries; only Mapbox is loaded lazily for the map
- **Easy editing** - All text lives directly in `index.html`, so crawlers and social scrapers see it without JavaScript
- **Static hosting** - Upload directly to any web host (Hostinger, etc.)

## 🏗️ Architecture
 
### Why This Approach?

1. **Simple content editing** - Text is plain HTML in `index.html`; edit it in place
2. **No complex tooling** - No npm, webpack, or build steps to maintain
3. **Zero dependencies** - Works offline, no package management headaches
4. **Direct upload** - FTP/file manager upload works perfectly
5. **Future-proof** - No framework updates or breaking changes to worry about

### Technology Stack

- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern features (flexbox, grid, custom properties)
- **Vanilla JavaScript** - ES6+ features, no frameworks
- **Google Fonts** - Raleway font family

## 📁 File Structure

```
almaswebsite/
├── index.html          # Main homepage - ⭐ ALL TEXT CONTENT LIVES HERE
├── mentions-legales.html # Legal page
├── style.css           # All styles - clean, no comments
├── app.js              # JavaScript - animations, map, Instagram card
├── images/             # All media assets
│   ├── hero-1.jpg      # Slideshow images
│   ├── hero-2.jpg
│   ├── hero-3.jpg
│   ├── pin.svg         # Custom map marker
│   └── ...             # Other images
├── favicon/            # Favicon files
├── fonts/              # Custom fonts (SugarMagic)
└── README.md           # This file
```

## 🎨 Design System

### Visual Style
- **Modern, bold, flat aesthetic** - Clean edges with subtle depth hints
- **Monochrome contrast** - Pure black paired with warm cream
- **Raleway font** - Used throughout for consistency
- **Typography** - Bold, large, confident text

### Key Design Features

1. **Ken Burns Hero Slideshow**
   - Crossfading background images with gentle panning
   - Shrinks on scroll with rounded border (TV effect)
   - Logo and tagline overlay
   - Dark overlay for text legibility

2. **Sticky Navigation**
   - Becomes sticky on scroll
   - Clean, flat design (no shadows)
   - Bold, large text (1.1rem, weight 600)
   - Taller padding for modern look

3. **Scroll Effects**
   - Sections reveal with fade-in animation
   - Hero slideshow shrinks and gains rounded border
   - Image blocks use vertical parallax motion
   - Smooth scroll behavior

### Color Palette

```css
--primary-color: #000000;    /* Black - text & accents */
--bg-light: #f5f1e8;         /* Cream - backgrounds */
--text-dark: #000000;        /* Black text */
--text-light: #f5f1e8;       /* Cream text */
--green: #5F9471;            /* Sage green - accents & buttons */
```

## ✏️ Content Management

**All text lives directly in `index.html`.** Headings, paragraphs, address and
opening hours are plain HTML. This was a deliberate change from an earlier
YAML-driven setup: search engines and social scrapers now see the full page
without running JavaScript, and there is no CDN dependency for rendering text.

### Editing Content

1. Open `index.html`
2. Find the section (`almas-cest-quoi`, `qui-sommes-nous`, `nos-prestations`, `notre-cafe`)
3. Edit the text inside the `<h2>` / `<p>` tags
4. Save and deploy

Paragraphs with several lines use `white-space: pre-line`, so a blank line in
the HTML source becomes a paragraph break on the page.

Punctuation in headings (`?`, `'`, `,`) is wrapped in `<span class="fallback-char">`
because the SugarMagic display font lacks those glyphs.

When you change the address or opening hours, also update the JSON-LD block at
the bottom of `index.html` so Google's structured data stays in sync.

### Adding Images

1. Place image in `/images` folder
2. Reference it from `index.html` with path: `/images/filename.jpg`
3. Add a descriptive `alt` attribute
4. Instagram preview images are listed in `INSTAGRAM_PREVIEWS` in `app.js`

## 🚀 Development

### Local Testing

The site needs to run on a server (not just opening HTML files) because:
- Root-relative paths (`/images/...`, `/fonts/...`) need a server root
- Google Fonts requests need proper origins

**Start local server:**
```bash
# Option 1: Use the included script
./start-server.sh

# Option 2: Python directly
cd cafe-website
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

### Making Changes

**For styling changes:**
- Edit `style.css` directly
- This is a **flat design** - keep shadows subtle and inset (no heavy drops)
- Use CSS custom properties (variables) for colors

**For content changes:**
- Edit the text in `index.html`
- Keep the JSON-LD block in sync when address or hours change

**For functionality changes:**
- Edit `app.js`
- Keep JavaScript vanilla (no frameworks)
- Comment complex logic

## 🌐 Deployment to Hostinger

### First Time Upload

1. Login to Hostinger File Manager (or use FTP)
2. Navigate to `public_html` or your domain folder
3. Upload ALL files maintaining structure:
   ```
   index.html
   mentions-legales.html
   style.css
   app.js
    images/
      ├── logo.png
      ├── hero-1.jpg
      ├── hero-2.jpg
      └── hero-3.jpg
   ```

### Updating Content

**For text/content changes:**
1. Edit `index.html` locally
2. Upload `index.html` to server
3. Done! Changes appear immediately

**For new images:**
1. Add image to `/images` folder
2. Reference it from `index.html`
3. Upload the image AND updated `index.html`

**For design changes:**
1. Edit `style.css` or `app.js`
2. Upload modified files
3. Users may need to clear cache (Ctrl+Shift+R)

## 🎬 Special Features

### Hero Slideshow

- Three high-resolution stills cycle with a gentle Ken Burns pan
- Images live in `index.html` (`.hero-slide` elements) and can be swapped there
- Use consistent aspect ratios (16:9 works best) to avoid cropping surprises
- Keep files optimized (under ~300KB each) for fast first paint

### Image Performance

- All content images load with `loading="lazy"` and `decoding="async"`
- Compress assets with Squoosh/TinyPNG before committing
- Export `png` only when transparency is required; otherwise prefer optimized JPEG/WebP
- Consider adding responsive sources (`srcset`) if future devices need sharper assets

### Scroll Effects

The site features several scroll-triggered effects:

1. **Hero Shrink Effect**
   - Slideshow scales from 100% to 85%
   - Gains rounded corners (16px)
   - 4px border appears as it shrinks
   - Inner blur increases for depth

2. **Sticky Navigation**
   - Sticks to top on scroll
   - Changes background when scrolled

3. **Reveal Animations**
   - Sections fade in when scrolled into view
   - Smooth opacity + translateY transitions

**All effects use CSS transitions** - no animation libraries needed.

## 🔧 Customization Guide for Future AI Assistants

### When Working on This Project

**DO:**
- ✅ Keep text content in plain HTML so crawlers see it without JS
- ✅ Keep vanilla JavaScript (no frameworks)
- ✅ Preserve the flat, modern aesthetic
- ✅ Use CSS custom properties for colors
- ✅ Keep navigation bold and prominent
- ✅ Test with local server before uploading
- ✅ Maintain mobile responsiveness

**DON'T:**
- ❌ Add build tools (webpack, npm scripts, etc.)
- ❌ Introduce frameworks (React, Vue, etc.)
- ❌ Add heavy drop shadows or glow effects
- ❌ Inject text content with JavaScript (search engines and scrapers must see it in the HTML)
- ❌ Add complex dependencies

### Design Principles

1. **Flat Design** - Mostly flat surfaces with minimal inset depth
2. **Bold Typography** - Large, confident text with Raleway
3. **Minimal Animations** - Smooth, purposeful, never distracting
4. **Dark & Light Contrast** - Dark backgrounds, light content areas
5. **Mobile-First** - Always responsive

### Common Tasks

**Adding a new section:**
1. Add HTML structure and text to `index.html`
2. Add styles to `style.css`
3. Add `reveal` class for scroll animation

**Changing colors:**
1. Update CSS custom properties in `:root`
2. Colors cascade throughout the site

**Adding a new page:**
1. Duplicate `index.html` structure
2. Give it its own `<title>`, `<meta name="description">` and canonical
3. Add it to `sitemap.xml`

## 🐛 Troubleshooting

### Hero Images Not Updating
- Confirm new files are saved in `/images`
- Update inline `style` URLs on `.hero-slide` elements in `index.html`
- Hard refresh the browser (Ctrl+Shift+R) to bust caches
- Verify filenames match case-sensitively (especially on Linux hosting)

### Text Changes Not Showing
- Clear browser cache (Ctrl+Shift+R)
- Verify `index.html` uploaded to server

### Sections Not Revealing
- Check `reveal` class is on section
- Verify JavaScript loaded (check console)
- Ensure scroll listener is working

### Mobile Issues
- Test responsive breakpoints in `style.css`
- Check mobile menu toggle functionality
- Ensure hero slideshow images are optimized (<300KB) for slower devices

## 📱 Browser Support

- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile:** iOS Safari, Chrome Android

## 📊 Performance

- **Optimize images:** Use TinyPNG/Squoosh before committing
- **Leverage lazy-loading:** All `<img>` tags already use `loading="lazy"`
- **Limit hero assets:** Keep slideshow images light to improve LCP
- **Fonts:** Already optimized with Google Fonts CDN
- **No JavaScript frameworks:** Site loads instantly

## 🔐 Security

- No user input = no XSS vulnerabilities
- No database = no SQL injection risks
- Static files only = minimal attack surface
- HTTPS recommended (Hostinger provides free SSL)

## 📝 License & Credits

Built for ALMAS restaurant with custom code.
- No third-party libraries (Mapbox GL is loaded lazily for the map only)
- All design and code original
- Raleway font by Google Fonts

---

## 💡 Philosophy Summary

This site prioritizes **simplicity over complexity**:

- Content is plain HTML anyone can edit
- No build process means no build failures
- Direct file upload means instant updates
- Vanilla JavaScript means no framework updates
- Modern CSS means no preprocessor needed

**When in doubt, keep it simple.** The goal is maintainability, not showcasing the latest tech stack.

---

**For questions or issues, refer to this README first. The architecture is intentional and should be preserved.**

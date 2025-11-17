# ALMAS - Restaurant Website

A modern, custom-built website for ALMAS restaurant featuring a clean, minimal architecture designed for easy content management without complex build tools.

## 🎯 Project Philosophy

This website was intentionally built with **simplicity and maintainability** in mind:

- **No build process** - Direct HTML/CSS/JS that works immediately
- **No frameworks** - Pure vanilla JavaScript for maximum simplicity
- **No dependencies** - Only uses a CDN for YAML parsing
- **Easy editing** - All content managed through a single YAML file
- **Static hosting** - Upload directly to any web host (Hostinger, etc.)

## 🏗️ Architecture
 
### Why This Approach?

1. **Non-technical content editing** - The site owner's friend can edit content by simply modifying `content.yaml`
2. **No complex tooling** - No npm, webpack, or build steps to maintain
3. **Zero dependencies** - Works offline, no package management headaches
4. **Direct upload** - FTP/file manager upload works perfectly
5. **Future-proof** - No framework updates or breaking changes to worry about

### Technology Stack

- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern features (flexbox, grid, custom properties)
- **Vanilla JavaScript** - ES6+ features, no frameworks
- **YAML** - Human-friendly content format
- **Google Fonts** - Raleway font family

## 📁 File Structure

```
almaswebsite/
├── index.html          # Main homepage
├── style.css           # All styles - clean, no comments
├── app.js              # JavaScript - clean, no comments
├── content.yaml        # ⭐ SINGLE SOURCE OF TRUTH FOR ALL CONTENT
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

### The YAML Approach

**All editable content lives in `content.yaml`**. This design choice means:

- ✅ Non-technical users can edit text and image paths
- ✅ Single file to manage = less confusion
- ✅ Version control friendly
- ✅ No database needed
- ✅ Clear structure with comments

### How It Works

1. Content is defined in `content.yaml`
2. JavaScript loads and parses the YAML on page load
3. DOM elements are populated dynamically
4. Images referenced by path in YAML

### Editing Content

To change ANY text or image on the site:

1. Open `content.yaml` in any text editor
2. Find the section you want to edit
3. Change the text or image path
4. Save the file
5. Upload to server (or refresh if testing locally)

**Example:**
```yaml
hero:
  heading: "ALMAS"
  subheading: "La cuisine de nos racines"
```

### Adding Images

1. Place image in `/images` folder
2. Reference it in `content.yaml` with path: `/images/filename.jpg`
3. Upload both the image and updated `content.yaml`

## 🚀 Development

### Local Testing

The site needs to run on a server (not just opening HTML files) because:
- YAML fetching requires HTTP/HTTPS
- CORS restrictions apply to `fetch`
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
- Edit `content.yaml` only
- Never hardcode content in HTML (slideshow image URLs remain inline by design)

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
   style.css
   app.js
   content.yaml
    images/
      ├── logo.png
      ├── hero-1.jpg
      ├── hero-2.jpg
      └── hero-3.jpg
   ```

### Updating Content

**For text/content changes:**
1. Edit `content.yaml` locally
2. Upload just `content.yaml` to server
3. Done! Changes appear immediately

**For new images:**
1. Add image to `/images` folder
2. Update `content.yaml` with new image path
3. Upload the image AND updated `content.yaml`

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
- ✅ Maintain the single YAML file approach
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
- ❌ Hardcode text content in HTML (hero slide image URLs are the lone exception)
- ❌ Break the YAML structure
- ❌ Add complex dependencies

### Design Principles

1. **Flat Design** - Mostly flat surfaces with minimal inset depth
2. **Bold Typography** - Large, confident text with Raleway
3. **Minimal Animations** - Smooth, purposeful, never distracting
4. **Dark & Light Contrast** - Dark backgrounds, light content areas
5. **Mobile-First** - Always responsive

### Common Tasks

**Adding a new section:**
1. Add HTML structure to `index.html`
2. Add styles to `style.css`
3. Add content structure to `content.yaml`
4. Add populate function in `app.js`
5. Add `reveal` class for scroll animation

**Changing colors:**
1. Update CSS custom properties in `:root`
2. Colors cascade throughout the site

**Adding a new page:**
1. Duplicate `index.html` structure
2. Add page-specific content to YAML
3. Add populate function in `app.js`

## 🐛 Troubleshooting

### Hero Images Not Updating
- Confirm new files are saved in `/images`
- Update inline `style` URLs on `.hero-slide` elements in `index.html`
- Hard refresh the browser (Ctrl+Shift+R) to bust caches
- Verify filenames match case-sensitively (especially on Linux hosting)

### YAML Changes Not Showing
- Clear browser cache (Ctrl+Shift+R)
- Check for YAML syntax errors (indentation!)
- Verify file uploaded to server
- Check browser console for errors

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
- No third-party libraries (except YAML parser CDN)
- All design and code original
- Raleway font by Google Fonts

---

## 💡 Philosophy Summary

This site prioritizes **simplicity over complexity**:

- A non-technical person can edit content via YAML
- No build process means no build failures
- Direct file upload means instant updates
- Vanilla JavaScript means no framework updates
- Modern CSS means no preprocessor needed

**When in doubt, keep it simple.** The goal is maintainability, not showcasing the latest tech stack.

---

**For questions or issues, refer to this README first. The architecture is intentional and should be preserved.**

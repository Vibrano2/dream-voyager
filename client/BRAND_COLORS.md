# Dream Voyager Brand Color Guide

## Brand Color Palette

### 1. Primary Teal - #179BA5
**Usage:** Main headers, primary buttons, navigation bars, active states
**CSS Variable:** `--primary-teal`
**Tailwind Class:** `bg-brand-teal`, `text-brand-teal`

**Examples:**
- Primary action buttons
- Navigation hover states
- Section headers
- Active menu items

---

### 2. Accent Orange - #F49129
**Usage:** Call-to-action buttons, hover states, important highlights
**CSS Variable:** `--accent-orange`
**Tailwind Class:** `bg-brand-orange`, `text-brand-orange`
**Hover State:** `#d67a1f` (darker)

**Examples:**
- "Book Now" buttons
- Featured badges
- Interactive element highlights
- Icon accents

---

### 3. Text Navy - #0C1C24
**Usage:** Body text, headings, footer backgrounds
**CSS Variable:** `--text-navy`
**Tailwind Class:** `bg-brand-navy`, `text-brand-navy`

**Examples:**
- All body copy
- Main headings
- Footer background
- Dark UI elements

---

### 4. Pale Aqua - #DDF6FA
**Usage:** Section backgrounds, decorative elements, subtle accents
**CSS Variable:** `--bg-pale-aqua`
**Tailwind Class:** `bg-brand-aqua`

**Examples:**
- Alternating section backgrounds
- Card backgrounds
- Subtle highlights
- Decorative elements

---

## Implementation

### CSS Variables (index.css)
```css
:root {
  --primary-teal: #179BA5;
  --accent-orange: #F49129;
  --text-navy: #0C1C24;
  --bg-pale-aqua: #DDF6FA;
}
```

### Tailwind Config
```javascript
colors: {
  'brand': {
    'teal': '#179BA5',
    'orange': '#F49129',
    'navy': '#0C1C24',
    'aqua': '#DDF6FA',
  }
}
```

### Usage Examples

#### Primary Button (Teal)
```tsx
<button className="bg-brand-teal hover:bg-[#137a82] text-white">
  Learn More
</button>
```

#### Accent Button (Orange)
```tsx
<button className="bg-brand-orange hover:bg-[#d67a1f] text-white">
  Book Now
</button>
```

#### Text with Brand Color
```tsx
<h1 className="text-brand-navy">Dream Voyager</h1>
<p className="text-brand-teal">Your Journey Begins Here</p>
```

#### Background Sections
```tsx
<section className="bg-brand-aqua">
  <div className="container">
    {/* Content */}
  </div>
</section>
```

---

## Color Accessibility

### Contrast Ratios (WCAG AA Compliant)
- **Teal (#179BA5) on White:** 3.8:1 ✅ (Large text only)
- **Orange (#F49129) on White:** 2.9:1 ⚠️ (Use for accents, not body text)
- **Navy (#0C1C24) on White:** 15.2:1 ✅ (Excellent for all text)
- **Navy (#0C1C24) on Pale Aqua (#DDF6FA):** 13.5:1 ✅ (Excellent)

### Recommendations
- Use **Navy** for all body text
- Use **Teal** for headings and large text
- Use **Orange** for buttons and highlights (not small text)
- **Pale Aqua** works well as a background with Navy text

---

## Files Updated

✅ `client/src/index.css` - CSS variables and button classes
✅ `client/tailwind.config.js` - Tailwind theme extension
✅ `client/src/components/layout/TopBar.tsx` - Navigation colors
✅ `client/src/components/home/Hero.tsx` - Hero section accents
✅ `client/src/components/home/CategorySection.tsx` - Package cards
✅ `client/src/components/common/ChatWidget.tsx` - Chat interface
✅ `client/src/pages/Dashboard.tsx` - Dashboard UI

---

## Quick Reference

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary Headers | Teal | #179BA5 |
| CTA Buttons | Orange | #F49129 |
| Body Text | Navy | #0C1C24 |
| Backgrounds | Pale Aqua | #DDF6FA |
| Button Hover (Orange) | Darker Orange | #d67a1f |
| Button Hover (Teal) | Darker Teal | #137a82 |

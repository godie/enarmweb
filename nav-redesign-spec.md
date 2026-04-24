# Navigation Rail Redesign - V2

## Overview

Redesign the V2 navigation rail (currently 15 items) to prioritize frequently used items and provide easy access to all options via a collapsible drawer pattern.

---

## Current State

**File:** `src/v2/components/V2Navi.jsx`
**Current items (15):**
1. Inicio (home)
2. Práctica (medical_services)
3. Simulacro (quiz)
4. Ranking (leaderboard)
5. Imágenes (image)
6. Repaso (flashcards)
7. Biblioteca (menu_book)
8. Errores (error_outline)
9. Contribuir (add_circle)
10. Mis Casos (history)
11. Mensajes (forum)
12. Suscripción (card_membership)
13. Cupones (confirmation_number)
14. Admin (admin_panel_settings)
15. Perfil (person)

**Issues identified:**
- 15 items in a narrow rail (80px wide) causes visual overload
- All items visible regardless of user needs/usage patterns
- No mobile-optimized solution for the long list

---

## User Requirements (from interview)

### UX Pattern
- **Expandable menu** with a **collapsible drawer** from the right side
- Items are prioritized by **frequency of use** (stored in localStorage)
- Maximum **5-6 visible items** on desktop (similar to mobile app patterns)

### Always Visible Items
- **Inicio** - Home/dashboard
- **Práctica** - Practice section
- These two items are NEVER hidden regardless of frequency

### Mobile Behavior
- Bottom navigation bar with horizontal scroll (existing pattern)
- **Solo iconos** (icons only, no labels)
- **Ver más** button opens a bottom sheet/drawer with all options

### Frequency Tracking
- Track navigation clicks per path
- **Persist in localStorage** between sessions
- Sort visible items by frequency count (highest first)
- Recalculate on each navigation

### Categories
- **No categories** - simple flat list in the drawer

---

## Design Specifications

### Desktop (≥1024px)

#### Visible Rail (5-6 items max)
```
┌──────┐
│  🔵  │  ← Logo (always visible)
├──────┤
│  🏠  │  ← Inicio (fixed)
│  ⚕️  │  ← Práctica (fixed)
│  📊  │  ← Rank #3 by frequency
│  📝  │  ← Rank #4 by frequency
│  📚  │  ← Rank #5 by frequency
│  📸  │  ← Rank #6 by frequency
├──────┤
│  ... │  ← Ver más (opens drawer)
│  🎨  │  ← Theme toggle (always visible)
└──────┘
```

#### Expandable Drawer (from right)
```
┌────────────────────────────────────────────────────────┐
│  Todas las opciones                            [X]     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  📊 Ranking          📝 Repaso          📚 Biblioteca  │
│                                                        │
│  📸 Imágenes         🧠 Errores        🔧 Contribuir   │
│                                                        │
│  📜 Mis Casos        💬 Mensajes       💳 Suscripción  │
│                                                        │
│  🎟️ Cupones          👤 Admin          👤 Perfil       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Drawer specs:**
- Width: 320px
- Background: `var(--md-sys-color-surface)`
- Shadow: `var(--v2-shadow-3)`
- Animation: Slide in from right, 300ms ease-out
- Backdrop: Semi-transparent scrim `var(--v2-scrim)` with blur

### Mobile (<600px)

#### Bottom Navigation Bar
```
┌─────────────────────────────────────────────────────────┐
│  🏠  │  ⚕️  │  📊  │  📝  │  📚  │  ... │  ☀️  │
└─────────────────────────────────────────────────────────┘
                                    ↑
                              Ver más
```

- Same logic but horizontal scrollable
- First 5-6 items visible, scroll for more
- Last visible item is **Ver más** button
- Opens bottom sheet with all options

#### Mobile Bottom Sheet
```
┌────────────────────────────────────────────────────────┐
│  ═══                                             [X]   │
│                                                        │
│  Todas las opciones                                    │
│                                                        │
│  🏠 Inicio        ⚕️ Práctica      📊 Ranking          │
│  📝 Repaso        📚 Biblioteca    📸 Imágenes         │
│  🧠 Errores       🔧 Contribuir    📜 Mis Casos        │
│  💬 Mensajes      💳 Suscripción   🎟️ Cupones          │
│  👤 Admin         👤 Perfil                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Bottom sheet specs:**
- Max height: 70vh
- Border radius: 28px (top corners)
- Handle indicator: 32px × 4px centered pill
- Animation: Slide up from bottom, 300ms ease-out

---

## Technical Implementation

### Frequency Tracking Service

```javascript
// Frequency tracking stored in localStorage
// Key: 'v2_nav_frequency'
// Structure: { '/dashboard': 45, '/practica': 38, ... }
```

**Functions needed:**
- `getNavFrequency()` - Returns frequency map from localStorage
- `incrementNavFrequency(path)` - Increment count for path, save to localStorage
- `getSortedItems(navItems, frequencyMap)` - Sort by frequency, return top items

### State Management

```javascript
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [visibleItems, setVisibleItems] = useState([]); // Computed from frequency
const [remainingItems, setRemainingItems] = useState([]); // Items in drawer
```

### Component Structure

```jsx
<V2Navi>
  {/* Logo - fixed */}
  <Link className='v2-nav-logo'>...</Link>
  
  {/* Always visible items */}
  <NavLink to='/dashboard'>Inicio</NavLink>
  <NavLink to='/practica'>Práctica</NavLink>
  
  {/* Frequency-sorted items (top 3-4 by usage) */}
  {sortedVisibleItems.map(item => <NavLink key={item.path}>...</NavLink>)}
  
  {/* Ver más button */}
  <button onClick={() => setIsDrawerOpen(true)}>
    <i>more_horiz</i>
    <span>Ver más</span>
  </button>
  
  {/* Theme toggle - fixed */}
  <button onClick={toggleTheme}>...</button>
  
  {/* Drawer (conditionally rendered) */}
  <V2NavDrawer 
    isOpen={isDrawerOpen} 
    onClose={() => setIsDrawerOpen(false)}
    items={remainingItems}
  />
</V2Navi>
```

### Drawer Component

```jsx
<V2NavDrawer>
  {/* Header with close button */}
  {/* Grid of all remaining items */}
</V2NavDrawer>
```

### Hook Usage

```jsx
useEffect(() => {
  // Track navigation
  incrementNavFrequency(currentPath);
  
  // Recalculate visible items
  const sorted = getSortedNavItems(navItems, frequencyMap);
  setVisibleItems(sorted);
}, [location]);
```

---

## Edge Cases & Behaviors

1. **New user (no frequency data):**
   - Default order: Inicio, Práctica, then alphabetical or custom default order
   - Frequency tracking starts from first navigation

2. **One-time access items (Admin, Perfil):**
   - These are low-frequency but important
   - Always included in drawer, never excluded
   - Frequency still tracked for consistency

3. **Reset frequency:**
   - Provide a way to reset in profile settings (future enhancement)
   - Clear localStorage key `v2_nav_frequency`

4. **Drawer closed state:**
   - Press ESC or click backdrop to close
   - Focus trap inside drawer when open
   - Body scroll disabled when drawer open

5. **Accessibility:**
   - Drawer has `role='dialog'` and `aria-modal='true'`
   - Focus moves to close button on open
   - Returns focus to trigger on close

---

## CSS Classes Needed

```css
/* Nav Rail */
.v2-nav-rail { /* existing */ }
.v2-nav-item { /* existing */ }
.v2-nav-item.visible { /* highlighted state */ }
.v2-nav-item.hidden { /* dimmed, in drawer only */ }

/* Ver más button */
.v2-nav-more-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  border-radius: 12px;
  background: var(--md-sys-color-surface-variant);
  cursor: pointer;
}
.v2-nav-more-btn:hover {
  background: var(--md-sys-color-outline-variant);
}

/* Drawer */
.v2-nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 320px;
  background: var(--md-sys-color-surface);
  box-shadow: var(--v2-shadow-3);
  z-index: 1100;
  transform: translateX(100%);
  transition: transform 300ms ease-out;
}
.v2-nav-drawer.open {
  transform: translateX(0);
}
.v2-nav-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: var(--v2-scrim);
  backdrop-filter: blur(4px);
  z-index: 1050;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms;
}
.v2-nav-drawer-backdrop.visible {
  opacity: 1;
  pointer-events: auto;
}

/* Mobile Bottom Sheet */
.v2-nav-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 70vh;
  background: var(--md-sys-color-surface);
  border-radius: 28px 28px 0 0;
  z-index: 1100;
  transform: translateY(100%);
  transition: transform 300ms ease-out;
}
.v2-nav-bottom-sheet.open {
  transform: translateY(0);
}
.v2-nav-bottom-sheet-handle {
  width: 32px;
  height: 4px;
  background: var(--md-sys-color-outline);
  border-radius: 2px;
  margin: 12px auto;
}

/* Drawer items grid */
.v2-nav-drawer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 16px;
}
.v2-nav-drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--md-sys-color-on-surface);
  transition: background-color 0.2s;
}
.v2-nav-drawer-item:hover {
  background: var(--md-sys-color-surface-variant);
}
.v2-nav-drawer-item:active {
  background: var(--md-sys-color-outline-variant);
}
```

---

## Implementation Order

1. **Create frequency tracking utility** (src/v2/utils/navFrequency.js)
2. **Update V2Navi component** with visibility logic
3. **Create V2NavDrawer component** (or inline in V2Navi)
4. **Add CSS for drawer and animations**
5. **Add mobile bottom sheet styles**
6. **Test on desktop at 1024px, 1440px, 1920px**
7. **Test on mobile at 375px, 414px**

---

## Items List (for reference)

| Label | Icon | Path | Fixed? |
|-------|------|------|--------|
| Inicio | home | /dashboard | YES |
| Práctica | medical_services | /practica | YES |
| Simulacro | quiz | /simulacro/setup | No |
| Ranking | leaderboard | /leaderboard | No |
| Imágenes | image | /imagenes | No |
| Repaso | style | /flashcards/repaso | No |
| Biblioteca | menu_book | /biblioteca | No |
| Errores | error_outline | /errores | No |
| Contribuir | add_circle | /contribuir | No |
| Mis Casos | history | /mis-contribuciones | No |
| Mensajes | forum | /mensajes | No |
| Suscripción | card_membership | /suscripcion | No |
| Cupones | confirmation_number | /cupones | No |
| Admin | admin_panel_settings | /admin | No |
| Perfil | person | /perfil | No |
/**
 * Navigation Frequency Tracking Utility
 * Tracks which navigation items users click most frequently
 * and persists data in localStorage between sessions.
 */

const STORAGE_KEY = 'v2_nav_frequency';

// Fixed items that are always visible regardless of frequency
export const FIXED_ITEMS = ['/dashboard', '/practica'];

// Default order for new users (when no frequency data exists)
export const DEFAULT_NAV_ORDER = [
  { label: 'Inicio', icon: 'home', path: '/dashboard' },
  { label: 'Práctica', icon: 'medical_services', path: '/practica' },
  { label: 'Simulacro', icon: 'quiz', path: '/simulacro/setup' },
  { label: 'Ranking', icon: 'leaderboard', path: '/leaderboard' },
  { label: 'Imágenes', icon: 'image', path: '/imagenes' },
  { label: 'Repaso', icon: 'style', path: '/flashcards/repaso' },
  { label: 'Biblioteca', icon: 'menu_book', path: '/biblioteca' },
  { label: 'Errores', icon: 'error_outline', path: '/errores' },
  { label: 'Contribuir', icon: 'add_circle', path: '/contribuir' },
  { label: 'Mis Casos', icon: 'history', path: '/mis-contribuciones' },
  { label: 'Mensajes', icon: 'forum', path: '/mensajes' },
  { label: 'Suscripción', icon: 'card_membership', path: '/suscripcion' },
  { label: 'Cupones', icon: 'confirmation_number', path: '/cupones' },
  { label: 'Admin', icon: 'admin_panel_settings', path: '/admin' },
  { label: 'Perfil', icon: 'person', path: '/perfil' },
];

/**
 * Get all frequency data from localStorage
 * @returns {Object} Frequency map { '/path': count }
 */
export const getNavFrequency = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Error reading nav frequency:', e);
    return {};
  }
};

/**
 * Increment frequency count for a specific path
 * @param {string} path - The navigation path
 */
export const incrementNavFrequency = (path) => {
  try {
    const frequency = getNavFrequency();
    frequency[path] = (frequency[path] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(frequency));
  } catch (e) {
    console.error('Error incrementing nav frequency:', e);
  }
};

/**
 * Sort nav items by frequency, placing fixed items first
 * @param {Array} items - Array of nav item objects
 * @param {Object} frequencyMap - Frequency map { path: count }
 * @param {number} topVisibleCount - How many non-fixed items to show (default 4)
 * @returns {Object} { visible: [], drawer: [] }
 */
export const getSortedNavItems = (items, frequencyMap, topVisibleCount = 4) => {
  // Separate fixed and dynamic items
  const fixedItems = items.filter(item => FIXED_ITEMS.includes(item.path));
  const dynamicItems = items.filter(item => !FIXED_ITEMS.includes(item.path));
  
  // Sort dynamic items by frequency (highest first)
  const sortedDynamic = [...dynamicItems].sort((a, b) => {
    const freqA = frequencyMap[a.path] || 0;
    const freqB = frequencyMap[b.path] || 0;
    return freqB - freqA;
  });
  
  // Get top N visible items (after fixed items)
  const visibleDynamic = sortedDynamic.slice(0, topVisibleCount);
  const drawerItems = sortedDynamic.slice(topVisibleCount);
  
  return {
    visible: [...fixedItems, ...visibleDynamic],
    drawer: drawerItems,
    allItems: items,
  };
};

/**
 * Reset all frequency data
 */
export const resetNavFrequency = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error resetting nav frequency:', e);
  }
};

/**
 * Get current sorted nav state
 * @param {number} topVisibleCount - How many dynamic items to show (default 4)
 * @returns {Object} { visible: [], drawer: [], frequency: {} }
 */
export const getNavState = (topVisibleCount = 4) => {
  const frequency = getNavFrequency();
  const result = getSortedNavItems(DEFAULT_NAV_ORDER, frequency, topVisibleCount);
  return {
    ...result,
    frequency,
  };
};
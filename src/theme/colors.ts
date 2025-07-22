// Color Psychology for Healthcare:
// - Blues: Trust, reliability, professionalism
// - Grays: Balance, sophistication
// - White: Cleanliness, purity
// - Subtle accents: Warmth and approachability

// Primary colors (Professional Blues)
const primary = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49'
};

// Secondary colors (Neutral Grays)
const secondary = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617'
};

// Accent colors (Subtle Warmth)
const accent = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
  950: '#431407'
};

// Gradient combinations
export const gradients = {
  primary: {
    light: 'from-blue-50 via-blue-100/80 to-sky-50',
    dark: 'from-blue-100 via-blue-50 to-white',
    hover: 'from-blue-100 via-blue-50 to-sky-50'
  },
  secondary: {
    light: 'from-gray-50 via-transparent to-blue-50/5',
    dark: 'from-gray-100/10 via-transparent to-blue-50/10'
  },
  text: {
    primary: 'from-gray-700 to-gray-900',
    secondary: 'from-gray-500 to-gray-700'
  }
};

// Background colors
export const background = {
  light: 'from-gray-50 to-white',
  dark: 'from-gray-100 to-white',
  overlay: 'bg-black/30'
};

// Text colors
export const text = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  muted: 'text-gray-400',
  light: 'text-gray-900',
  lightMuted: 'text-gray-600',
  accent: 'text-blue-600'
};

// Border colors
export const border = {
  light: 'border-gray-100',
  medium: 'border-gray-200',
  accent: 'border-gray-100',
  accentHover: 'hover:border-gray-200'
};

// Shadow configurations
const shadow = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-md',
  primary: 'shadow-gray-100/70',
  primaryHover: 'hover:shadow-gray-200/70'
};

// Status colors (Clean & Professional)
const status = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-100'
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100'
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100'
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100'
  }
};

// Button variants
const button = {
  primary: `
    bg-blue-600
    text-white 
    hover:bg-blue-700
    shadow-sm
    hover:shadow
  `,
  secondary: `
    bg-white 
    text-gray-700 
    border
    border-gray-200
    hover:border-gray-300
    hover:bg-gray-50
  `,
  outline: `
    border border-gray-200 
    text-gray-700 
    hover:bg-gray-50
    hover:border-gray-300
  `
};

// Form element styles (Clean & Minimal)
const form = {
  input: {
    base: `
      border-gray-200 
      focus:ring-1
      focus:ring-blue-500
      focus:border-blue-500
    `,
    hover: 'hover:border-gray-300'
  },
  select: {
    base: `
      border-gray-200 
      focus:ring-1
      focus:ring-blue-500
      focus:border-blue-500
    `
  }
};




// Theme utilities
export type Theme = 'light' | 'dark';

export const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  }
  return 'light';
};

export const setTheme = (theme: Theme) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

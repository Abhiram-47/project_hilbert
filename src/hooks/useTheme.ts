import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'sepia' | 'forest' | 'ocean' | 'sunset';

export interface ThemeConfig {
  name: string;
  colors: {
    bg: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    accent: string;
    accentHover: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: 'Light',
    colors: {
      bg: 'bg-gray-50',
      surface: 'bg-white',
      surfaceHover: 'hover:bg-gray-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      accent: 'bg-blue-500',
      accentHover: 'hover:bg-blue-600',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      bg: 'bg-gray-900',
      surface: 'bg-gray-800',
      surfaceHover: 'hover:bg-gray-700',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      accent: 'bg-blue-600',
      accentHover: 'hover:bg-blue-700',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
    }
  },
  sepia: {
    name: 'Sepia',
    colors: {
      bg: 'bg-amber-50',
      surface: 'bg-amber-25',
      surfaceHover: 'hover:bg-amber-100',
      text: 'text-amber-900',
      textSecondary: 'text-amber-800',
      textMuted: 'text-amber-600',
      border: 'border-amber-200',
      accent: 'bg-amber-600',
      accentHover: 'hover:bg-amber-700',
      success: 'bg-green-600',
      warning: 'bg-orange-600',
      error: 'bg-red-700',
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      bg: 'bg-emerald-50',
      surface: 'bg-white',
      surfaceHover: 'hover:bg-emerald-50',
      text: 'text-emerald-900',
      textSecondary: 'text-emerald-800',
      textMuted: 'text-emerald-600',
      border: 'border-emerald-200',
      accent: 'bg-emerald-600',
      accentHover: 'hover:bg-emerald-700',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      bg: 'bg-slate-50',
      surface: 'bg-white',
      surfaceHover: 'hover:bg-slate-50',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      border: 'border-slate-200',
      accent: 'bg-cyan-600',
      accentHover: 'hover:bg-cyan-700',
      success: 'bg-emerald-600',
      warning: 'bg-amber-600',
      error: 'bg-rose-600',
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      bg: 'bg-orange-50',
      surface: 'bg-white',
      surfaceHover: 'hover:bg-orange-50',
      text: 'text-orange-900',
      textSecondary: 'text-orange-800',
      textMuted: 'text-orange-600',
      border: 'border-orange-200',
      accent: 'bg-orange-600',
      accentHover: 'hover:bg-orange-700',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
    }
  }
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('digital-garden-theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('digital-garden-theme', currentTheme);
  }, [currentTheme]);

  const theme = themes[currentTheme];

  const switchTheme = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
  };

  const cycleTheme = () => {
    const themeKeys = Object.keys(themes) as Theme[];
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setCurrentTheme(themeKeys[nextIndex]);
  };

  return {
    currentTheme,
    theme,
    switchTheme,
    cycleTheme,
    availableThemes: Object.keys(themes) as Theme[]
  };
}
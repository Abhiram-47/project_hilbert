import React, { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { useTheme, Theme, themes } from '../hooks/useTheme';

const ThemeSelector: React.FC = () => {
  const { currentTheme, theme, switchTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeIcon = (themeName: Theme) => {
    const iconMap = {
      light: '☀️',
      dark: '🌙',
      sepia: '📜',
      forest: '🌲',
      ocean: '🌊',
      sunset: '🌅'
    };
    return iconMap[themeName];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${theme.colors.surface} ${theme.colors.surfaceHover} ${theme.colors.border} border ${theme.colors.text}`}
      >
        <Palette size={16} />
        <span className="text-sm font-medium">{theme.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full left-0 mt-2 ${theme.colors.surface} ${theme.colors.border} border rounded-lg shadow-lg z-20 min-w-[160px]`}>
            {availableThemes.map((themeName) => (
              <button
                key={themeName}
                onClick={() => {
                  switchTheme(themeName);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentTheme === themeName 
                    ? `${theme.colors.accent} text-white` 
                    : `${theme.colors.surfaceHover} ${theme.colors.text}`
                }`}
              >
                <span className="text-lg">{getThemeIcon(themeName)}</span>
                <span className="text-sm font-medium">{themes[themeName].name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
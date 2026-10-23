import { useEffect, useState } from 'react';

const KEY = 'theme'; // localStorage: 'light' | 'dark' | missing = follow the system
const OPTIONS = [
  { value: null, label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function readSaved() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null; // storage can be blocked (private mode); just follow the system
  }
}

/**
 * Auto / Light / Dark. The choice is saved and applied as <html data-theme="…">; tokens.css does the rest.
 * index.html applies the saved choice before the page paints, so there is no flash of the wrong theme.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(readSaved);

  useEffect(() => {
    const root = document.documentElement;
    try {
      if (theme) localStorage.setItem(KEY, theme);
      else localStorage.removeItem(KEY);
    } catch {
      /* not saved; still applied for this visit */
    }
    if (theme) root.dataset.theme = theme;
    else delete root.dataset.theme;
  }, [theme]);

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTIONS.map((o) => (
        <button key={o.label} aria-pressed={theme === o.value} onClick={() => setTheme(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

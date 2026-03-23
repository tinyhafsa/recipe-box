// import predefined themes
import { themes } from "./themes";

// function to apply theme
export function applyTheme(themeKey) {
  const theme = themes[themeKey]; // get theme
  if (!theme) return;

  const root = document.documentElement; // get root html element

  // apply colors as CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // apply backgrounds as CSS variables
  Object.entries(theme.backgrounds).forEach(([key, value]) => {
    root.style.setProperty(`--bg-${key}`, `url(${value})`);
  });

  // save the selected theme in localStorage
  localStorage.setItem("theme", themeKey);
}
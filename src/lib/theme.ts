export const THEME_KEY = "portfolio-theme";

/** Runs before the page paints; its input is only a validated local preference. */
export const THEME_SCRIPT = `(function(){try{var saved=localStorage.getItem('${THEME_KEY}');var theme=saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch(e){var theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}})();`;

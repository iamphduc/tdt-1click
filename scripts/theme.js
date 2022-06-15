async function main() {
  const { theme } = await chrome.storage.sync.get("theme");

  const mediaPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  if (typeof theme === "string") {
    setTheme(theme);
  } else if (mediaPrefersDark.matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  mediaPrefersDark.addEventListener("change", (darkTheme) => {
    if (darkTheme.matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  });
}
main();

function setTheme(mode = "light") {
  document.documentElement.setAttribute("data-theme", mode);
}

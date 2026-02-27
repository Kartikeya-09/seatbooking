import { useEffect, useState } from "react";

const getInitialTheme = () => {
  const stored = localStorage.getItem("seatflow_theme");
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return "light";
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("seatflow_theme", theme);
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const handleToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;

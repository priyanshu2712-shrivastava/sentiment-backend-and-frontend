import { createContext, useContext, useEffect, useState } from "react";

const UtilsContext = createContext();

export const UtilsProvider = ({ children }) => {
  const getInitialTheme = () => {

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;


    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);


  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  return (
    <UtilsContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </UtilsContext.Provider>
  );
};

export const useUtils = () => useContext(UtilsContext);


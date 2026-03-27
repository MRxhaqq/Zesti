import { createContext, useContext, useState, useEffect } from "react";

const ZestiContext = createContext(null);

export function ZestiProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [mealPlan, setMealPlan] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [bookmarkDrawerOpen, setBookmarkDrawerOpen] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("zesti-theme");
    const savedBookmarks = localStorage.getItem("zesti-bookmarks");
    const savedMealPlan = localStorage.getItem("zesti-mealplan");

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedMealPlan) setMealPlan(JSON.parse(savedMealPlan));
  }, []);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem("zesti-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Persist meal plan
  useEffect(() => {
    localStorage.setItem("zesti-mealplan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("zesti-theme", next ? "dark" : "light");
      return next;
    });
  };

  const toggleBookmark = (recipe) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.idMeal === recipe.idMeal);
      return exists
        ? prev.filter((b) => b.idMeal !== recipe.idMeal)
        : [...prev, recipe];
    });
  };

  const isBookmarked = (id) => bookmarks.some((b) => b.idMeal === id);

  const addToMealPlan = (day, recipe) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: [...prev[day].filter((r) => r.idMeal !== recipe.idMeal), recipe],
    }));
  };

  const removeFromMealPlan = (day, recipeId) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: prev[day].filter((r) => r.idMeal !== recipeId),
    }));
  };

  return (
    <ZestiContext.Provider
      value={{
        isDark,
        toggleTheme,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        mealPlan,
        addToMealPlan,
        removeFromMealPlan,
        bookmarkDrawerOpen,
        setBookmarkDrawerOpen,
      }}
    >
      {children}
    </ZestiContext.Provider>
  );
}

export function useZesti() {
  const ctx = useContext(ZestiContext);
  if (!ctx) throw new Error("useZesti must be used inside ZestiProvider");
  return ctx;
}

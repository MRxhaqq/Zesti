import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export function useRecipes(query = "", category = "") {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 500);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url;

      if (debouncedQuery.trim()) {
        // Search by name
        url = `${BASE}/search.php?s=${encodeURIComponent(debouncedQuery)}`;
      } else if (category && category !== "All") {
        // Filter by category
        url = `${BASE}/filter.php?c=${encodeURIComponent(category)}`;
      } else {
        // Default — search for popular meals
        url = `${BASE}/search.php?s=`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, category]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, loading, error, refetch: fetchRecipes };
}

export async function fetchRecipeById(id) {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals?.[0] || null;
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/categories.php`);
  const data = await res.json();
  return data.categories || [];
}

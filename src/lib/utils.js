// Format cooking time
export function formatTime(minutes) {
  if (!minutes) return "N/A";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Extract ingredients from TheMealDB recipe object
// TheMealDB stores ingredients as strIngredient1 ... strIngredient20
export function extractIngredients(meal) {
  if (!meal) return [];
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }
  return ingredients;
}

// Truncate text to a given length
export function truncate(text, length = 100) {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
}

// Get difficulty label based on ingredient count
export function getDifficulty(ingredientCount) {
  if (ingredientCount <= 5) return { label: "Easy", color: "#2d6a4f" };
  if (ingredientCount <= 10) return { label: "Medium", color: "#f4a261" };
  return { label: "Hard", color: "#e85d26" };
}

// Get area flag emoji
export const AREA_FLAGS = {
  American: "🇺🇸",
  British: "🇬🇧",
  Canadian: "🇨🇦",
  Chinese: "🇨🇳",
  Croatian: "🇭🇷",
  Dutch: "🇳🇱",
  Egyptian: "🇪🇬",
  Filipino: "🇵🇭",
  French: "🇫🇷",
  Greek: "🇬🇷",
  Indian: "🇮🇳",
  Irish: "🇮🇪",
  Italian: "🇮🇹",
  Jamaican: "🇯🇲",
  Japanese: "🇯🇵",
  Kenyan: "🇰🇪",
  Malaysian: "🇲🇾",
  Mexican: "🇲🇽",
  Moroccan: "🇲🇦",
  Polish: "🇵🇱",
  Portuguese: "🇵🇹",
  Russian: "🇷🇺",
  Spanish: "🇪🇸",
  Thai: "🇹🇭",
  Tunisian: "🇹🇳",
  Turkish: "🇹🇷",
  Ukrainian: "🇺🇦",
  Vietnamese: "🇻🇳",
};

export function getAreaFlag(area) {
  return AREA_FLAGS[area] || "🌍";
}

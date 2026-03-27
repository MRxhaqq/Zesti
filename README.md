# Zesti 🍽️

A premium recipe discovery web application powered by TheMealDB API. Find, save, and plan your meals for the week with a beautiful, responsive interface.

## Live Demo

[View live](https://your-zesti-url.vercel.app)

## Screenshot

![Zesti Screenshot](public/og-image.png)

---

## Features

### Recipe Discovery

- Instant search by recipe name or ingredient with 500ms debouncing
- Category filtering with live API fetch and silent hardcoded fallback
- Responsive recipe grid with CLS-matched skeleton loading (minimum 400ms display)
- Empty state with helpful messaging when no results are found

### Recipe Cards

- Food photography from TheMealDB
- Consistent pseudo-random star rating per recipe
- Cuisine area flag emoji
- Category and difficulty badges
- Ingredient count
- Image skeleton while loading, emoji fallback on error
- Hover animations — image zoom, button color change, shadow elevation

### Recipe Modal

- Slides up from bottom on mobile, centered on desktop
- Three tabs — Ingredients, Instructions, Details
- **Ingredients tab** — interactive servings scaler (1–20), ingredient measures scale proportionally
- **Instructions tab** — numbered steps with first step highlighted in ember orange, YouTube video link
- **Details tab** — key/value breakdown of recipe metadata
- Auto-fetches full recipe data when card came from category filter endpoint
- Scroll lock when modal is open
- Close on Escape key or overlay click

### Bookmark System

- Save any recipe with the bookmark button on cards or inside the modal
- Slide-in bookmark drawer from the right
- Bookmark count badge on navbar updates in real time
- Saved recipes persist across page refreshes via localStorage
- Remove individual bookmarks with trash icon

### Meal Planner

- Dedicated `/planner` route via React Router
- Drag and drop recipes from saved list onto any day of the week
- Built with `@dnd-kit` — accessible, touch-friendly
- Visual drop target highlight when dragging over a day column
- Drag preview follows cursor while dragging
- Move recipes between days by dragging
- Remove recipes with × button
- Clear all meals at once
- Total meals count in planner header
- Meal plan persists across page refreshes via localStorage

### UI and UX

- Custom ember orange glowing dot cursor on desktop
- Light / dark mode toggle — preference saved to localStorage
- Fully responsive — single column on mobile, multi-column on desktop
- Smooth page transitions between Home and Planner
- Framer Motion animations throughout — cards, modal, drawer, cursor
- Glass morphism navbar on scroll with blur backdrop

---

## Tech Stack

| Technology                 | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| React 19                   | UI framework                             |
| React Router v7            | Client-side routing (`/` and `/planner`) |
| Motion (Framer Motion v12) | Animations and transitions               |
| @dnd-kit/core              | Drag and drop engine                     |
| @dnd-kit/sortable          | Sortable list utilities                  |
| Tailwind CSS v4            | Utility styling                          |
| Lucide React               | Icons                                    |
| TheMealDB API              | Recipe data — free, no API key required  |
| Vite                       | Build tool and dev server                |
| Vercel                     | Deployment                               |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky navbar with scroll blur, theme toggle, bookmark badge
│   ├── Hero.jsx            # Full-screen hero with search bar and suggestion pills
│   ├── SearchBar.jsx       # Controlled search input with focus glow and clear button
│   ├── FilterChips.jsx     # Live category chips with hardcoded fallback
│   ├── RecipeGrid.jsx      # Orchestrates fetch, skeleton, empty state, and card grid
│   ├── RecipeCard.jsx      # Individual recipe card with image, badges, and bookmark
│   ├── RecipeModal.jsx     # Full recipe detail modal with three tabs
│   ├── MealPlanner.jsx     # (Integrated into Planner page)
│   ├── BookmarkDrawer.jsx  # Slide-in saved recipes drawer
│   ├── EmptyState.jsx      # No results state with reset CTA
│   ├── LoadingGrid.jsx     # 8 CLS-matched skeleton cards
│   ├── CustomCursor.jsx    # Ember orange glowing dot cursor
│   └── Footer.jsx          # Minimal footer with API credit
├── context/
│   └── ZestiContext.jsx    # Global state — theme, bookmarks, meal plan
├── hooks/
│   ├── useRecipes.js       # TheMealDB API calls with debouncing
│   └── useDebounce.js      # 500ms debounce hook
├── lib/
│   └── utils.js            # Helpers — extractIngredients, getDifficulty, getAreaFlag
├── pages/
│   ├── Home.jsx            # Main page — hero + grid + modal + drawer
│   └── Planner.jsx         # Meal planner page with drag and drop
├── App.jsx                 # BrowserRouter + Routes + CustomCursor
└── main.jsx                # React entry point
```

---

## Architecture Decisions

**TheMealDB filter endpoint returns minimal data**
When filtering by category, the API only returns `idMeal`, `strMeal`, and `strMealThumb` — no ingredients or instructions. The modal detects this and auto-fetches the full recipe by ID before rendering tab content.

**Graceful degradation on FilterChips**
The categories are fetched live from TheMealDB on mount with a 3-second timeout. If the request fails or times out, a hardcoded list of 12 common categories is used silently. The user never sees an empty filter row.

**Minimum 400ms skeleton display**
A `MIN_LOADING_MS` constant ensures the skeleton always shows for at least 400ms even if the API responds instantly. This prevents a jarring flash of loading state on fast connections — a technique used by Stripe and Linear.

**CLS-matched skeletons**
The `LoadingGrid` skeleton cards match the exact dimensions of `RecipeCard` (220px image height, ~160px body) to prevent Cumulative Layout Shift when real content loads.

**Custom cursor hidden on touch devices**
`CustomCursor` checks `window.matchMedia('(pointer: coarse)')` on mount and returns null on touch screens, preventing the default cursor from being hidden on mobile.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/MRxhaqq/zesti.git
cd zesti
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
```

---

## API Reference

This project uses [TheMealDB](https://www.themealdb.com/api.php) — a free, open recipe database. No API key required.

| Endpoint                   | Usage                  |
| -------------------------- | ---------------------- |
| `/search.php?s={query}`    | Search recipes by name |
| `/filter.php?c={category}` | Filter by category     |
| `/lookup.php?i={id}`       | Get full recipe by ID  |
| `/categories.php`          | List all categories    |

---

## Deployment

This project is deployed on Vercel. The `vercel.json` file in the `public` folder handles client-side routing rewrites so `/planner` works correctly on page refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

No environment variables are required.

---

## Contact

**Shuaib Abdulhaqq Omeiza**

- Email: mrxhaqq@gmail.com
- GitHub: [github.com/MRxhaqq](https://github.com/MRxhaqq)
- LinkedIn: [Abdulhaqq Shuaib](https://linkedin.com/in/abdulhaqq-shuaib-56769239b)

# Pokédex Lite

A beautifully designed, full-featured Pokédex web application built with React and TypeScript.

![Pokédex Lite](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

## 🚀 Live Demo

> Deploy to Vercel: Click "New Project" → Import from GitHub → Deploy (zero config needed)

---

## ✨ Features

### Mandatory
- **Data Fetching** — All Pokémon fetched from [PokéAPI](https://pokeapi.co/) with loading spinners and error handling
- **Responsive Grid** — Works perfectly on mobile (2-col), tablet, and desktop (auto-fill)
- **Search** — Live search by Pokémon name with instant results
- **Type Filtering** — Filter by any of the 18 Pokémon types dynamically fetched from the API
- **Pagination** — Navigate through all 1000+ Pokémon, 20 per page
- **Favorites** — Heart any Pokémon; favorites persisted via `localStorage`
- **Detail Modal** — Click any card to see HP, ATK, DEF, stats with animated bars, abilities, and moves. Toggle shiny form!

### Bonus
- **Animations** — Framer Motion powered: card entrance stagger, hover lift effects, modal spring, stat bar fills, tab transitions
- **Shiny Toggle** — View shiny variants in the detail modal

---

## 🛠 Tech Stack

| Technology | Why |
|---|---|
| **React 18** | Component-based UI, fast re-renders |
| **TypeScript** | Type safety, better DX, fewer runtime bugs |
| **Framer Motion** | Fluid animations and transitions |
| **Axios** | Clean HTTP requests with interceptors |
| **CSS Modules (plain)** | Scoped styles, no runtime overhead |
| **PokéAPI** | Free, complete Pokémon data source |

---

## 📦 Installation & Running Locally

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/pokedex-lite.git
cd pokedex-lite

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output is in the `build/` folder — ready to deploy to Vercel, Netlify, or GitHub Pages.

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── PokemonCard.tsx       # Individual Pokémon card with hover effects
│   ├── PokemonModal.tsx      # Detail modal with stats, abilities, moves
│   ├── SearchBar.tsx         # Debounced search input
│   ├── TypeFilter.tsx        # Type filter chips
│   ├── Pagination.tsx        # Page navigation
│   └── LoadingSpinner.tsx    # Animated Pokéball spinner
├── context/
│   └── FavoritesContext.tsx  # Global favorites state with localStorage
├── hooks/
│   └── usePokemonList.ts     # Data fetching + filtering logic
├── types/
│   └── index.ts              # All TypeScript interfaces
├── utils/
│   ├── api.ts                # Axios wrappers for PokéAPI
│   └── constants.ts          # Type colors, stat labels/colors
├── App.tsx                   # Root layout + modal orchestration
└── App.css                   # Global styles, grid, header
```

---

## 🎨 Design Decisions

- **Dark theme** with type-reactive glows — each card's glow matches the Pokémon's primary type
- **Bebas Neue + Space Mono** — bold display font paired with monospace for that tech/retro feel
- **Radial gradients per type** — no two cards look the same
- **Sticky header** with backdrop blur for easy navigation while scrolling

---

## ⚡ Challenges & Solutions

| Challenge | Solution |
|---|---|
| PokéAPI doesn't return images in list endpoint | Fetch individual Pokémon details in parallel with `Promise.all` |
| Search returns no list — only direct lookup | Direct `GET /pokemon/:name` for name searches |
| Type filtering returns full Pokémon list at once | Slice client-side for pagination after type filter |
| Favorites need to persist across sessions | `localStorage` synced via `useEffect` in context |
| Modal needs complete move list | Re-fetch individual Pokémon on modal open if moves array is empty |

---

## 📄 License

MIT

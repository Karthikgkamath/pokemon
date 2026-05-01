
A beautifully designed, full-featured Pokédex web application built with React and TypeScript.


## Live Demo

Netlify deployed project-https://astounding-starlight-d0c55d.netlify.app/

---



## Tech Stack

| Technology | Why |
|---|---|
| **React 18** | Component-based UI, fast re-renders |
| **TypeScript** | Type safety, better DX, fewer runtime bugs |
| **Framer Motion** | Fluid animations and transitions |
| **Axios** | Clean HTTP requests with interceptors |
| **CSS Modules (plain)** | Scoped styles, no runtime overhead |
| **PokéAPI** | Free, complete Pokémon data source |

---

## nstallation & Running Locally

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



---

## Project Structure

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

## Challenges & Solutions

- Favorites / All control UX: Initially the app used a single toggle that both switched between "All" and "Favorites" and also changed the label in place. I implemented the two-button group so each button explicitly selects the corresponding dataset (favorites vs all). This avoids accidental toggles and makes the behavior explicit.

- Filtering while in Favorites: Another UX edge-case was that selecting `All Types` in the type filter while viewing favorites would accidentally switch the app back to the global "All" list. I fixed this by separating the type-selection behavior from which dataset is shown — changing types now only updates the selected type, and the `Favorites` / `All` buttons control which dataset is visible.

- Persisting favorites: To keep favorites between sessions, I used `localStorage` with a small wrapper in `FavoritesContext`. The favorites are stored as an array in localStorage and reloaded on startup, avoiding loss on refresh.

---



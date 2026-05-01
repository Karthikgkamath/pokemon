import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pokemon } from "./types";
import { fetchPokemon } from "./utils/api";
import { FavoritesProvider, useFavorites } from "./context/FavoritesContext";
import { usePokemonList, PAGE_SIZE_EXPORT } from "./hooks/usePokemonList";
import { PokemonCard } from "./components/PokemonCard";
import { PokemonModal } from "./components/PokemonModal";
import { SearchBar } from "./components/SearchBar";
import { TypeFilter } from "./components/TypeFilter";
import { Pagination } from "./components/Pagination";
import { LoadingSpinner } from "./components/LoadingSpinner";
import "./App.css";

const AppInner: React.FC = () => {
  const { favorites } = useFavorites();
  const {
    pokemons,
    loading,
    error,
    totalCount,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    showFavoritesOnly,
    setShowFavoritesOnly,
  } = usePokemonList(favorites);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const handleCardClick = useCallback(async (pokemon: Pokemon) => {
    if (!pokemon.moves || pokemon.moves.length === 0) {
      setModalLoading(true);
      try {
        const full = await fetchPokemon(pokemon.id);
        setSelectedPokemon(full);
      } catch {
        setSelectedPokemon(pokemon);
      } finally {
        setModalLoading(false);
      }
    } else {
      setSelectedPokemon(pokemon);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  return (
    <div className="app">
      
      <div className="app-bg">
        <div className="bg-blob b1" />
        <div className="bg-blob b2" />
        <div className="bg-blob b3" />
        <div className="bg-grid" />
      </div>
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-area">
            <div className="logo-icon">◉</div>
            <div>
              <h1 className="logo-title">POKÉDEX</h1>
              <p className="logo-sub">LITE</p>
            </div>
          </div>
          <div className="header-stats">
            <span className="stat-badge">
              {totalCount.toLocaleString()} <span>Pokémon</span>
            </span>
            {favorites.size > 0 && (
              <span className="stat-badge fav-stat">
                ♥ {favorites.size} <span>Favorites</span>
              </span>
            )}
          </div>
        </div>
      </header>
      <div className="controls-section">
        <div className="controls-top">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name..."
          />
          <div className="fav-controls">
            <button
              className={`fav-toggle ${showFavoritesOnly ? "active" : ""}`}
              onClick={() => setShowFavoritesOnly(true)}
            >
              ♥ <span>Favorites</span>
            </button>
            <button
              className={`fav-toggle all-btn ${!showFavoritesOnly ? "active" : ""}`}
              onClick={() => setShowFavoritesOnly(false)}
            >
              ♡ <span>All</span>
            </button>
          </div>
        </div>
        <TypeFilter selected={selectedType} onChange={handleTypeChange} />
      </div>
      <main className="main-content">
        {loading || modalLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">✕</div>
            <p className="error-msg">{error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : pokemons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <p className="empty-msg">
              {showFavoritesOnly
                ? "No favorites yet. Start catching!"
                : "No Pokémon found. Try a different search."}
            </p>
          </div>
        ) : (
          <motion.div
            className="pokemon-grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {pokemons.map((pokemon, i) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  index={i}
                  onClick={() => handleCardClick(pokemon)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && !error && pokemons.length > 0 && (
          <Pagination
            page={page}
            totalCount={totalCount}
            pageSize={PAGE_SIZE_EXPORT}
            onPageChange={setPage}
          />
        )}
      </main>

      <AnimatePresence>
        {selectedPokemon && (
          <PokemonModal pokemon={selectedPokemon} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => (
  <FavoritesProvider>
    <AppInner />
  </FavoritesProvider>
);

export default App;

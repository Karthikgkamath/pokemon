import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pokemon } from "../types";
import { TYPE_COLORS } from "../utils/constants";
import { getPokemonImageUrl } from "../utils/api";
import { useFavorites } from "../context/FavoritesContext";
import "./PokemonCard.css";

interface Props {
  pokemon: Pokemon;
  onClick: () => void;
  index: number;
}
export const PokemonCard=({ pokemon, onClick, index }:Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const favorite = isFavorite(pokemon.id);

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const colors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    getPokemonImageUrl(pokemon.id);
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  return (
    <motion.div
      className="pokemon-card"
      style={
        {
          "--type-color": colors.bg,
          "--type-glow": colors.glow,
        } as React.CSSProperties
      }
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      layout
    >
      <div className="card-bg" />
      <div className="card-inner">
        <div className="card-header">
          <span className="pokemon-id">#{String(pokemon.id).padStart(4, "0")}</span>
          <button
            className={`fav-btn ${favorite ? "active" : ""}`}
            onClick={handleFavorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {favorite ? "♥" : "♡"}
          </button>
        </div>

        <div className="card-image-wrap">
          <div className="image-glow" />
          {!imgError ? (
            <img
              src={imageUrl}
              alt={pokemon.name}
              className="pokemon-img"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="img-fallback">?</div>
          )}
        </div>

        <div className="card-footer">
          <h3 className="pokemon-name">
            {pokemon.name.replace(/-/g, " ")}
          </h3>
          <div className="type-chips">
            {pokemon.types.map((t) => {
              const c = TYPE_COLORS[t.type.name] || TYPE_COLORS.normal;
              return (
                <span
                  key={t.type.name}
                  className="type-chip"
                  style={{ background: c.bg, color: c.text }}
                >
                  {t.type.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

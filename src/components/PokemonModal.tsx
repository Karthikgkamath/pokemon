import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pokemon } from "../types";
import { TYPE_COLORS, STAT_COLORS, STAT_LABELS } from "../utils/constants";
import { getPokemonImageUrl } from "../utils/api";
import { useFavorites } from "../context/FavoritesContext";
import "./PokemonModal.css";
interface Props {
  pokemon: Pokemon | null;
  onClose: () => void;
}
export const PokemonModal= ({ pokemon, onClose }:Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<"stats" | "abilities" | "moves">("stats");
  const [shiny, setShiny] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const colors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
  const favorite = isFavorite(pokemon.id);

  const imageUrl = shiny
    ? pokemon.sprites.other?.["official-artwork"]?.front_shiny ||
      pokemon.sprites.front_shiny ||
      getPokemonImageUrl(pokemon.id)
    : pokemon.sprites.other?.["official-artwork"]?.front_default ||
      getPokemonImageUrl(pokemon.id);

  const maxStat = 255;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-container"
          style={
            {
              "--type-color": colors.bg,
              "--type-glow": colors.glow,
            } as React.CSSProperties
          }
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background effects */}
          <div className="modal-bg-gradient" />
          <div className="modal-bg-circles">
            <div className="bg-circle c1" />
            <div className="bg-circle c2" />
          </div>

          {/* Header */}
          <div className="modal-header">
            <div className="modal-id">#{String(pokemon.id).padStart(4, "0")}</div>
            <div className="modal-actions">
              <button
                className={`modal-fav-btn ${favorite ? "active" : ""}`}
                onClick={() => toggleFavorite(pokemon.id)}
                aria-label="Toggle favorite"
              >
                {favorite ? "♥" : "♡"}
              </button>
              <button className="modal-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
          </div>

          {/* Pokemon image */}
          <div className="modal-image-section">
            <div className="modal-image-glow" />
            <motion.img
              key={shiny ? "shiny" : "normal"}
              src={imageUrl || getPokemonImageUrl(pokemon.id)}
              alt={pokemon.name}
              className="modal-pokemon-img"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
            />
            <button
              className={`shiny-toggle ${shiny ? "active" : ""}`}
              onClick={() => setShiny(!shiny)}
              title="Toggle shiny form"
            >
              ✦ {shiny ? "Shiny" : "Normal"}
            </button>
          </div>

          {/* Pokemon name and types */}
          <div className="modal-identity">
            <h2 className="modal-name">{pokemon.name.replace(/-/g, " ")}</h2>
            <div className="modal-types">
              {pokemon.types.map((t) => {
                const c = TYPE_COLORS[t.type.name] || TYPE_COLORS.normal;
                return (
                  <span
                    key={t.type.name}
                    className="modal-type-chip"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {t.type.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="modal-quick-stats">
            <div className="quick-stat">
              <span className="qs-value">{(pokemon.height / 10).toFixed(1)}m</span>
              <span className="qs-label">Height</span>
            </div>
            <div className="quick-stat-divider" />
            <div className="quick-stat">
              <span className="qs-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
              <span className="qs-label">Weight</span>
            </div>
            <div className="quick-stat-divider" />
            <div className="quick-stat">
              <span className="qs-value">{pokemon.base_experience || "—"}</span>
              <span className="qs-label">Base XP</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="modal-tabs">
            {(["stats", "abilities", "moves"] as const).map((tab) => (
              <button
                key={tab}
                className={`modal-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="modal-tab-content">
            <AnimatePresence mode="wait">
              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  className="tab-panel"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {pokemon.stats.map((stat) => {
                    const color = STAT_COLORS[stat.stat.name] || "#aaa";
                    const label = STAT_LABELS[stat.stat.name] || stat.stat.name;
                    const pct = Math.min((stat.base_stat / maxStat) * 100, 100);
                    return (
                      <div key={stat.stat.name} className="stat-row">
                        <span className="stat-label">{label}</span>
                        <span className="stat-value">{stat.base_stat}</span>
                        <div className="stat-bar-bg">
                          <motion.div
                            className="stat-bar-fill"
                            style={{ background: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === "abilities" && (
                <motion.div
                  key="abilities"
                  className="tab-panel"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="abilities-list">
                    {pokemon.abilities.map((a) => (
                      <div key={a.ability.name} className="ability-item">
                        <span className="ability-name">
                          {a.ability.name.replace(/-/g, " ")}
                        </span>
                        {a.is_hidden && (
                          <span className="hidden-badge">Hidden</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "moves" && (
                <motion.div
                  key="moves"
                  className="tab-panel moves-panel"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="moves-grid">
                    {pokemon.moves.slice(0, 24).map((m) => (
                      <span key={m.move.name} className="move-chip">
                        {m.move.name.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                  {pokemon.moves.length > 24 && (
                    <p className="moves-more">+{pokemon.moves.length - 24} more moves</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

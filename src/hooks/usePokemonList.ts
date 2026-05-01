import { useState, useEffect, useCallback } from "react";
import { Pokemon, PokemonListItem } from "../types";
import {
  fetchPokemonList,
  fetchPokemon,
  fetchPokemonByType,
  getPokemonIdFromUrl,
} from "../utils/api";

const PAGE_SIZE = 20;

interface UsePokemonListResult {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  setPage: (p: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
}

export const usePokemonList = (favoriteIds: Set<number>): UsePokemonListResult => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const handleSetSearchQuery = useCallback((q: string) => {
    setSearchQuery(q);
    setPage(0);
  }, []);

  const handleSetSelectedType = useCallback((t: string) => {
    setSelectedType(t);
    setPage(0);
  }, []);

  const handleSetShowFavoritesOnly = useCallback((v: boolean) => {
    setShowFavoritesOnly(v);
    setPage(0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let items: PokemonListItem[] = [];
        let total = 0;

        if (showFavoritesOnly) {
         
          const ids = Array.from(favoriteIds);
          const results = await Promise.all(ids.map((id) => fetchPokemon(id)));
          if (!cancelled) {
            let filtered = results;
            if (searchQuery.trim()) {
              filtered = filtered.filter((p) =>
                p.name.includes(searchQuery.toLowerCase().trim())
              );
            }
            if (selectedType) {
              filtered = filtered.filter((p) =>
                p.types.some((t) => t.type.name === selectedType)
              );
            }
            setPokemons(filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE));
            setTotalCount(filtered.length);
          }
          return;
        }

        if (selectedType) {
          const typeData = await fetchPokemonByType(selectedType);
          items = typeData.pokemon.map((p) => p.pokemon);
          if (searchQuery.trim()) {
            items = items.filter((p) =>
              p.name.includes(searchQuery.toLowerCase().trim())
            );
          }
          total = items.length;
          items = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
        } else if (searchQuery.trim()) {
          
          try {
            const result = await fetchPokemon(searchQuery.toLowerCase().trim());
            if (!cancelled) {
              setPokemons([result]);
              setTotalCount(1);
            }
            return;
          } catch {
            // Not found
            if (!cancelled) {
              setPokemons([]);
              setTotalCount(0);
            }
            return;
          }
        } else {
          const listData = await fetchPokemonList(PAGE_SIZE, page * PAGE_SIZE);
          items = listData.results;
          total = listData.count;
        }

        if (!cancelled) {
          setTotalCount(total);
        }

        const details = await Promise.all(
          items.map((item) => fetchPokemon(getPokemonIdFromUrl(item.url)))
        );

        if (!cancelled) {
          setPokemons(details);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load Pokémon. Please try again.");
          setPokemons([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [page, searchQuery, selectedType, showFavoritesOnly, favoriteIds]);

  return {
    pokemons,
    loading,
    error,
    totalCount,
    page,
    setPage,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    selectedType,
    setSelectedType: handleSetSelectedType,
    showFavoritesOnly,
    setShowFavoritesOnly: handleSetShowFavoritesOnly,
  };
};
export const PAGE_SIZE_EXPORT = PAGE_SIZE;

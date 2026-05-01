import { useState, useEffect, useCallback, useRef } from "react";

import { Pokemon } from "../types";
import {
  fetchPokemonList,
  fetchPokemon,
  fetchPokemonByType,
  fetchAllPokemonNames,
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
  namesLoading: boolean;
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
  const [namesLoading, setNamesLoading] = useState(true);
  const allNamesRef = useRef<{ name: string; url: string }[]>([]);
  useEffect(() => {
    fetchAllPokemonNames()
      .then((names) => {
        allNamesRef.current = names;
        setNamesLoading(false);
      })
      .catch(() => {
        setNamesLoading(false);
      });
  }, []);

  const getNameFilteredList = useCallback((query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return allNamesRef.current;
    return allNamesRef.current.filter((item) =>
      item.name.startsWith(q)
    );
  }, []);

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
        if (showFavoritesOnly) {
          let ids = Array.from(favoriteIds);

          if (searchQuery.trim()) {
            const matchedNames = getNameFilteredList(searchQuery);
            const matchedIds = new Set(
              matchedNames.map((item) => getPokemonIdFromUrl(item.url))
            );
            ids = ids.filter((id) => matchedIds.has(id));
          }

          const results = await Promise.all(ids.map((id) => fetchPokemon(id)));

          if (!cancelled) {
            let filtered = results;

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
        if (searchQuery.trim() && selectedType) {
          const nameMatches = getNameFilteredList(searchQuery);
          const pageSlice = nameMatches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
          const details = await Promise.all(
            pageSlice.map((item) => fetchPokemon(getPokemonIdFromUrl(item.url)))
          );
          const typeFiltered = details.filter((p) =>
            p.types.some((t) => t.type.name === selectedType)
          );
          if (!cancelled) {
            setPokemons(typeFiltered);
            setTotalCount(nameMatches.length);
          }
          return;
        }
        if (searchQuery.trim()) {
          const nameMatches = getNameFilteredList(searchQuery);
          const total = nameMatches.length;
          const pageSlice = nameMatches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
          if (!cancelled) setTotalCount(total);
          const details = await Promise.all(
            pageSlice.map((item) => fetchPokemon(getPokemonIdFromUrl(item.url)))
          );
          if (!cancelled) setPokemons(details);
          return;
        }
        if (selectedType) {
          const typeData = await fetchPokemonByType(selectedType);
          const items = typeData.pokemon.map((p) => p.pokemon);
          const total = items.length;
          const pageSlice = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
          if (!cancelled) setTotalCount(total);
          const details = await Promise.all(
            pageSlice.map((item) => fetchPokemon(getPokemonIdFromUrl(item.url)))
          );
          if (!cancelled) setPokemons(details);
          return;
        }
        const listData = await fetchPokemonList(PAGE_SIZE, page * PAGE_SIZE);
        if (!cancelled) setTotalCount(listData.count);
        const details = await Promise.all(
          listData.results.map((item) => fetchPokemon(getPokemonIdFromUrl(item.url)))
        );
        if (!cancelled) setPokemons(details);
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

  }, [page, searchQuery, selectedType, showFavoritesOnly, favoriteIds, getNameFilteredList]);

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
    namesLoading,
  };
};
export const PAGE_SIZE_EXPORT = PAGE_SIZE;
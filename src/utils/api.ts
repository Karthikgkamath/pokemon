import axios from "axios";
import { Pokemon, PokemonListResponse, PokemonTypeDetail } from "../types";
const BASE_URL = "https://pokeapi.co/api/v2";
export const api = axios.create({ baseURL: BASE_URL });

export const fetchPokemonList = async (
  limit: number,
  offset: number
): Promise<PokemonListResponse> => {
  const { data } = await api.get<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
  return data;
};

export const fetchPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const { data } = await api.get<Pokemon>(`/pokemon/${nameOrId}`);
  return data;
};

export const fetchPokemonByType = async (type: string): Promise<PokemonTypeDetail> => {
  const { data } = await api.get<PokemonTypeDetail>(`/type/${type}`);
  return data;
};
export const fetchAllTypes = async (): Promise<string[]> => {
  const { data } = await api.get("/type?limit=30");
  return data.results
    .map((t: { name: string }) => t.name)
    .filter(
      (name: string) =>
        !["unknown", "shadow"].includes(name)
    );
};

export const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1]);
};
export const getPokemonImageUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

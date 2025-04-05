import { getAllPokemon, getPokemonData } from "../service/pokemonAPIservice.js";

var PokemonListDisplay = [];

const populatePokemon = async () => {
  const pokemonResults = await getAllPokemon();
  const pokemonPromises = pokemonResults.map(async (u) => {
    const pokemonInfo = await getPokemonData(u.url);
    return await {
      name: u.name,
      id: pokemonInfo.id,
      sprite: pokemonInfo.sprites.front_default,
      types: pokemonInfo.types.map((t) => t.type.name),
    };
  });
  PokemonListDisplay = await Promise.all(pokemonPromises);
};

export const getPokemonListDisplay = () => {
  return [...PokemonListDisplay];
};

await populatePokemon();

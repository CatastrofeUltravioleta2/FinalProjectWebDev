import { getAllPokemon, getPokemonData } from "../service/pokemonAPIservice.js";

var PokemonListDisplay = [];
var currentPokemonOnDisplay = [];
var PokemonInTeam = [];
var AmountInTeam = 0;

const populatePokemon = async () => {
  const pokemonResults = await getAllPokemon();
  const pokemonPromises = pokemonResults.map(async (u) => {
    const pokemonInfo = await getPokemonData(u.url);
    return await {
      name: u.name,
      id: pokemonInfo.id,
      sprite: pokemonInfo.sprites.front_default,
      types: pokemonInfo.types.map((t) => t.type.name),
      onTeam: false,
    };
  });
  PokemonListDisplay = await Promise.all(pokemonPromises);
  currentPokemonOnDisplay = [...PokemonListDisplay];
};

export const getPokemonListDisplay = () => {
  return [...currentPokemonOnDisplay];
};

export const getAmountInTeam = () => {
  return AmountInTeam;
};

export const getPokemonById = (id) => {
  return PokemonListDisplay[PokemonListDisplay.findIndex((p) => p.id == id)];
};

export const addPokemonToTeam = (pokemon) => {
  pokemon.onTeam = true;
  AmountInTeam += 1;
  PokemonInTeam.push(pokemon);
  currentPokemonOnDisplay.splice(
    currentPokemonOnDisplay.findIndex((p) => p.id == pokemon.id),
    1
  );
  console.log(currentPokemonOnDisplay);
};

export const removePokemonFromTeam = (pokemon) => {
  pokemon.onTeam = false;
  AmountInTeam -= 1;
  PokemonInTeam.splice(
    PokemonInTeam.findIndex((p) => p.id == pokemon.id),
    1
  );
  currentPokemonOnDisplay.push(pokemon);
  currentPokemonOnDisplay.sort((a, b) => a.id - b.id);
  console.log(currentPokemonOnDisplay)
};

await populatePokemon();

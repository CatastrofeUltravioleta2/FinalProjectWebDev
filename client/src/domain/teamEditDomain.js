import { getPokemonDataFromId } from "../service/pokemonAPIservice.js";

var pokemonTeamData = [];

export const populateTeam = async (ids) => {
  const promises = ids.map(async (id, index) => {
    const pokemon = await getPokemonDataFromId(id);
    pokemon.teamIndex = index ;
    return pokemon;
  });

  pokemonTeamData = await Promise.all(promises);
};

export const getPokemonTeamData = () => {
  return [...pokemonTeamData];
};

export const getPokemonDataForCards = () => {
  const dataForCards = pokemonTeamData.map((p) => {
    return {
      name: p.name,
      id: p.id,
      sprite: p.sprites.front_default,
      types: p.types.map((t) => t.type.name),
      teamIndex: p.teamIndex
    };
  });
  return dataForCards
};

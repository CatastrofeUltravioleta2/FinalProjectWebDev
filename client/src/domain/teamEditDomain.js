import { getPokemonDataFromId } from "../service/pokemonAPIservice.js";
import { sendTeamToAPI } from "../service/pokemonTeamService.js";

var pokemonTeamData = [];

export const populateTeam = async (ids) => {
  const promises = ids.map(async (id, index) => {
    const pokemon = await getPokemonDataFromId(id);
    pokemon.teamIndex = index;
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
      teamIndex: p.teamIndex,
      abilities: p.abilities,
      moves: selectMoves(p.moves),
    };
});
  return dataForCards;
};

const selectMoves = (moves) => {
  return moves.filter((m) => {
    var isMoveFirstGen = false;
    m.version_group_details.forEach((v) => {
      if (
        v.version_group.name == "red-blue" ||
        v.version_group.name == "yellow"
      ) {
        isMoveFirstGen = true;
      }
    });
    return isMoveFirstGen;
  });
};

export const sendTeamInfoToApi = () => {

}

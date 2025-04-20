import { getMoveData, getPokemonDataFromId } from "../service/pokemonAPIservice.js";
import { getTeamById, sendTeamToAPI } from "../service/pokemonTeamService.js";

var pokemonTeamData = [];
var teamEditing = [];
var possibleAbilities = [
  {
    name: "speed boost",
    effect: "This Pokémon's Speed rises one stage after each turn.",
  },
  {
    name: "sturdy",
    effect:
      "Prevents being KOed from full HP, leaving 1 HP instead.  Protects against the one-hit KO moves regardless of HP.",
  },
  {
    name: "overgrow",
    effect:
      "Strengthens grass moves to inflict 1.5× damage at 1/3 max HP or less.",
  },
  {
    name: "blaze",
    effect:
      "Strengthens fire moves to inflict 1.5× damage at 1/3 max HP or less.",
  },
  {
    name: "torrent",
    effect:
      "Strengthens water moves to inflict 1.5× damage at 1/3 max HP or less.",
  },
  {
    name: "swarm",
    effect:
      "Strengthens bug moves to inflict 1.5× damage at 1/3 max HP or less.",
  },
  {
    name: "tinted lens",
    effect: "Doubles damage inflicted with not-very-effective moves.",
  },
  {
    name: "intimidate",
    effect: "Lowers opponents' Attack one stage upon entering battle.",
  },
  {
    name: "technician",
    effect: "Strengthens moves of 60 base power or less to 1.5× their power.",
  },
  {
    name: "justified",
    effect: "Raises Attack one stage upon taking damage from a dark move.",
  },
  {
    name: "water absorb",
    effect: "Absorbs water moves, healing for 1/4 max HP.",
  },
  {
    name: "analytic",
    effect: "Strengthens moves to 1.3× their power when moving last.",
  },
  {
    name: "thick fat",
    effect: "Halves damage from fire and ice moves.",
  },
  {
    name: "levitate",
    effect: "Evades ground moves.",
  },
  {
    name: "weak armor",
    effect:
      "Raises Speed and lowers Defense by one stage each upon being hit by a physical move.",
  },
  {
    name: "aftermath",
    effect:
      "Damages the attacker for 1/4 its max HP when knocked out by a contact move.",
  },
  {
    name: "filter",
    effect: "Decreases damage taken from super-effective moves by 1/4.",
  },
  {
    name: "moxie",
    effect: "Raises Attack one stage upon KOing a Pokémon.",
  },
];

export const getAllAbilities = () => {
  return [...possibleAbilities];
};
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

export const getPokemonDataForCards = async () => {
  const dataForCards = await Promise.all(pokemonTeamData.map( async (p) => {
    return {
      name: p.name,
      id: p.id,
      sprite: p.sprites.front_default,
      types: p.types.map((t) => t.type.name),
      teamIndex: p.teamIndex,
      abilities: getAllAbilities(),
      moves: await selectMoves(p.moves),
    };
  }));
  return dataForCards;
};

const selectMoves = async (moves) => {
  const IncludeMoves = await Promise.all(
    moves.map(async (m) => {
      var moveData = await getMoveData(m.move.url);
      var isMoveFirstGen = false;

      m.version_group_details.forEach((v) => {
        if (
          v.version_group.name == "red-blue" ||
          v.version_group.name == "yellow"
        ) {
          isMoveFirstGen = true;
        }
      });

      return isMoveFirstGen && moveData.damage_class["name"] != "status";
    })
  );

  return moves.filter((m, index) => IncludeMoves[index]);
};

export const setTeamEditing = async (id) => {
  const response = await getTeamById(id);
  teamEditing = response.pokemons;
};

export const getTeamEditing = () => {
  return [...teamEditing];
};

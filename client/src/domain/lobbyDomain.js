import {
  getAbilityData,
  getMoveData,
  getPokemonDataFromId,
} from "../service/pokemonAPIservice.js";

var currentTeam = {};
var currentTeamForBattle = {};

export const populateCurrentTeamLobby = (team) => {
  currentTeam = team;
  console.log(currentTeam);
};

export const populatePokemonForBattle = async () => {
  currentTeamForBattle.pokemons = [];
  currentTeamForBattle.teamId = currentTeam.teamId;
  currentTeamForBattle.owner = currentTeam.owner;

  currentTeam.pokemons.forEach(async (pokemon) => {
    var pokeData = await getPokemonDataFromId(pokemon.id);
    var pokemonMoves = [];

    pokemon.movesURL.forEach(async (move) => {
      var moveData = await getMoveData(move);
      pokemonMoves.push({
        Name: moveData.name,
        Power: moveData.power,
        Accuracy: moveData.accuracy,
        PP: moveData.pp,
        MoveClass: moveData.damage_class["name"],
        Type: moveData.type["name"],
      })
    });

    var abilityData = await getAbilityData(pokemon.abilityURL)

    currentTeamForBattle.pokemons.push({
        Id: pokeData.id,
        Types: pokeData.types.map((t) => t.type.name),
        Name: pokeData.name,
        HP: pokeData.stats[0].base_stat,
        Attack: pokeData.stats[1].base_stat,
        Defense: pokeData.stats[2].base_stat,
        SpecialAttack: pokeData.stats[3].base_stat,
        SpecialDefense: pokeData.stats[4].base_stat,
        Speed: pokeData.stats[5].base_stat,
        Moves: pokemonMoves,
        Ability: {Name: abilityData.name, Effect: abilityData.effect_entries[1]["effect"]}
    })
  });

  console.log(currentTeamForBattle)
};

export const getTeamForBattle = () => {
    return currentTeamForBattle;
}
import {
  getAbilityData,
  getMoveData,
  getPokemonDataFromId,
} from "../service/pokemonAPIservice.js";

var currentTeam = {};
var currentTeamForBattle = {};

var userTeam = {};
var oponentTeam = {};

var userTeamMedia = [];
var oponentTeamMedia = [];

export const getUserTeam = () => {
  return {...userTeam};
}

export const getOponentTeam = () => {
  return {...oponentTeam};
}

export const getUserMedia = () => {
  return [...userTeamMedia];
}

export const getOponentMedia = () => {
  return [...oponentTeamMedia];
}

export const populateCurrentTeamLobby = (team) => {
  currentTeam = team;
};

export const populatePokemonForBattle = async () => {
  currentTeamForBattle.pokemons = [];
  currentTeamForBattle.teamId = currentTeam.teamId;
  currentTeamForBattle.owner = currentTeam.owner;

  const promises = currentTeam.pokemons.map(async (pokemon) => {
    var pokeData = await getPokemonDataFromId(pokemon.id);

    const pokemonMoves = await Promise.all(
      pokemon.movesURL.map(async (move) => {
        var moveData = await getMoveData(move);

        return {
          Name: moveData.name,
          Power: moveData.power == null ? 0 : moveData.power,
          Accuracy: moveData.accuracy == null ? 0 : moveData.accuracy,
          PP: moveData.pp,
          BasePP: moveData.pp,
          MoveClass: moveData.damage_class["name"],
          Type: moveData.type["name"],
        };
      })
    );

    var abilityData = await getAbilityData(pokemon.abilityURL);
    var effect = abilityData.effect_entries.findIndex(
      (aData) => aData.language["name"] == "en"
    );
    const RealHP =
      Math.floor(
        ((2 * pokeData.stats[0].base_stat + 15.5 + Math.floor(85 / 4)) * 50) /
          100
      ) +
      50 +
      10;
    const RealAttack =
      Math.floor(
        ((2 * pokeData.stats[1].base_stat + 15.5 + Math.floor(85 / 4)) * 50) /
          100
      ) + 5;
    const RealDefense =
      Math.floor(
        ((2 * pokeData.stats[2].base_stat + 15.5 + Math.floor(85 / 4)) * 50) /
          100
      ) + 5;
    const RealSpecialAttack =
      Math.floor(
        ((2 * pokeData.stats[3].base_stat + 15.5 + Math.floor(85 / 4)) * 50) /
          100
      ) + 5;
    const RealSpecialDefense =
      Math.floor(
        ((2 * pokeData.stats[4].base_stat + 15.5 + Math.floor(85 / 4)) * 50) /
          100
      ) + 5;
    const RealSeped =
      Math.floor(
        ((2 * pokeData.stats[5].base_stat + 15.5 + Math.floor(85 / 4)) * 50) /
          100
      ) + 5;
    return {
      Id: pokeData.id,
      Types: pokeData.types.map((t) => t.type.name),
      Name: pokeData.name,
      OriginalStats: [
        RealHP,
        RealAttack,
        RealDefense,
        RealSpecialAttack,
        RealSpecialDefense,
        RealSeped,
      ],
      HP: RealHP,
      Attack: RealAttack,
      Defense: RealDefense,
      SpecialAttack: RealSpecialAttack,
      SpecialDefense: RealSpecialDefense,
      Speed: RealSeped,
      Moves: pokemonMoves,
      Ability: {
        Name: abilityData.name,
        Effect: abilityData.effect_entries[effect]["short_effect"],
      },
    };
  });

  currentTeamForBattle.pokemons = await Promise.all(promises);
  console.log(currentTeamForBattle);
};

export const getTeamForBattle = () => {
  return currentTeamForBattle;
};

export const setTeams = async (response, UpdateUICallback) => {
  const user = sessionStorage.getItem("username");
  const email = sessionStorage.getItem("email");
  const userData = `${user}|${email}`;

  if (Object.keys(response).length != 0) {
    if (response.type == "teamUpdate") {

      if (response.player1.Info == userData) {

        userTeam = response.player1.Team;
        oponentTeam = response.player2.Team;
      } else {

        userTeam = response.player2.Team;
        oponentTeam = response.player1.Team;
      }

      console.log(`user team: `, userTeam);
      console.log(`oponent team: `, oponentTeam);

      if (userTeamMedia.length == 0) {
        await setupPokemonMedia();

        console.log(userTeamMedia);
        console.log(oponentTeamMedia);
      }

      UpdateUICallback();
    }
  }
};

const setupPokemonMedia = async () => {
  const promises1 = userTeam.Pokemons.map(async (p) => {
    const pokeData = await getPokemonDataFromId(p.Id);
    return {
      frontSprite: pokeData.sprites.front_default,
      backSprite: pokeData.sprites.back_default,
      cry: pokeData.cries.latest,
    };
  });
  userTeamMedia = await Promise.all(promises1);

  const promises2 = oponentTeam.Pokemons.map(async (p) => {
    const pokeData = await getPokemonDataFromId(p.Id);
    return {
      frontSprite: pokeData.sprites.front_default,
      backSprite: pokeData.sprites.back_default,
      cry: pokeData.cries.latest,
    };
  });
  oponentTeamMedia = await Promise.all(promises2);

};

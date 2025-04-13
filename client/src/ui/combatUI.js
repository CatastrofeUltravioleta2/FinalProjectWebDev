import {
  getOponentMedia,
  getOponentTeam,
  getUserMedia,
  getUserTeam,
  populateCurrentTeamLobby,
  populatePokemonForBattle,
  setTeams,
} from "../domain/combatDomain.js";
import {
  addMessageHandler,
  initializeWebSocket,
} from "../service/combatSerivce.js";
import { getTeamById } from "../service/pokemonTeamService.js";

const getTeamFromQueryString = async () => {
  const queryString = window.location.search.slice(1);
  populateCurrentTeamLobby(await getTeamById(queryString));
};

const setupJoinGame = (connectionResponse) => {
  const displayResponse = document.getElementById("connectionResponse");

  if (Object.keys(connectionResponse).length != 0) {
    if (connectionResponse.type == "userStatus") {
      displayResponse.textContent = connectionResponse.message;
    } else if (connectionResponse.type == "joinGame") {
      //switch to battle mode
      displayResponse.style.display = "none";
      document.getElementById("header").style.display = "none";
      document.getElementById("BattleScreen").style.display = "flex";
    }
  }
};

const UpdateUI = (response) => {
  if (response.type != "teamUpdate") {
    return;
  }
  const userTeam = getUserTeam();
  const oponentTeam = getOponentTeam();
  const userMedia = getUserMedia();
  const oponentMedia = getOponentMedia();
  const oponentCurrentIndex = oponentTeam.ActivePokemonIndex;
  const userCurrentIndex = userTeam.ActivePokemonIndex;

  //change name
  const oponentCurrentPokemonTitle = document.getElementById(
    "oponentCurrentPokemon"
  );
  const userCurrentPokemonTitle = document.getElementById("userCurrentPokemon");

  oponentCurrentPokemonTitle.textContent = `${oponentTeam.Pokemons[oponentCurrentIndex].Name} Lvl. 50`;
  userCurrentPokemonTitle.textContent = `${userTeam.Pokemons[userCurrentIndex].Name} Lvl. 50`;

  //change displayed HP
  const oponentHPDisplay = document.getElementById("oponentHPDisplay");
  oponentHPDisplay.textContent = `${oponentTeam.Pokemons[oponentCurrentIndex].HP}/${oponentTeam.Pokemons[oponentCurrentIndex].OriginalStats[0]}`;
  const oponentHealthBar = document.getElementById("oponentHealthBar");
  oponentHealthBar.style.width = `${
    (oponentTeam.Pokemons[oponentCurrentIndex].HP /
      oponentTeam.Pokemons[oponentCurrentIndex].OriginalStats[0]) *
    100
  }%`;

  const userHPDisplay = document.getElementById("userHPDisplay");
  userHPDisplay.textContent = `${userTeam.Pokemons[userCurrentIndex].HP}/${userTeam.Pokemons[userCurrentIndex].OriginalStats[0]}`;
  const userHealthBar = document.getElementById("userHealthBar");
  userHealthBar.style.width = `${
    (userTeam.Pokemons[userCurrentIndex].HP /
      userTeam.Pokemons[userCurrentIndex].OriginalStats[0]) *
    100
  }%`;

  //change sprite
  const oponentSprite = document.getElementById("oponentActiveSprite");
  oponentSprite.src = oponentMedia[oponentCurrentIndex].frontSprite;

  const userSprite = document.getElementById("userActiveSprite");
  userSprite.src = userMedia[userCurrentIndex].backSprite;

  //change display stats
  const oponentHP = document.getElementById("oponentHP");
  oponentHP.textContent = `HP: ${oponentTeam.Pokemons[oponentCurrentIndex].HP}`;
  const oponentAttack = document.getElementById("oponentAttack");
  oponentAttack.textContent = `Attack: ${oponentTeam.Pokemons[oponentCurrentIndex].Attack}`;
  const oponentDefense = document.getElementById("oponentDefense");
  oponentDefense.textContent = `Defense: ${oponentTeam.Pokemons[oponentCurrentIndex].Defense}`;
  const oponentSpecialAttack = document.getElementById("oponentSpAttack");
  oponentSpecialAttack.textContent = `Special Attack: ${oponentTeam.Pokemons[oponentCurrentIndex].SpecialAttack}`;
  const oponentSpecialDefense = document.getElementById("oponentSpDefense");
  oponentSpecialDefense.textContent = `Special Defense: ${oponentTeam.Pokemons[oponentCurrentIndex].SpecialDefense}`;
  const oponentSpeed = document.getElementById("oponentSpeed");
  oponentSpeed.textContent = `Speed: ${oponentTeam.Pokemons[oponentCurrentIndex].Speed}`;
  const oponentTypes = document.getElementById("oponentTypes");
  oponentTeam.Pokemons[oponentCurrentIndex].Types.forEach((type) => {
    const typeLI = document.createElement("li");
    typeLI.textContent = type;
    oponentTypes.appendChild(typeLI);
  });

  const userHP = document.getElementById("userHP");
  userHP.textContent = `HP: ${userTeam.Pokemons[userCurrentIndex].HP}`;
  const userAttack = document.getElementById("userAttack");
  userAttack.textContent = `Attack: ${userTeam.Pokemons[userCurrentIndex].Attack}`;
  const userDefense = document.getElementById("userDefense");
  userDefense.textContent = `Defense: ${userTeam.Pokemons[userCurrentIndex].Defense}`;
  const userSpecialAttack = document.getElementById("userSpAttack");
  userSpecialAttack.textContent = `Special Attack: ${userTeam.Pokemons[userCurrentIndex].SpecialAttack}`;
  const userSpecialDefense = document.getElementById("userSpDefense");
  userSpecialDefense.textContent = `Special Defense: ${userTeam.Pokemons[userCurrentIndex].SpecialDefense}`;
  const userSpeed = document.getElementById("userSpeed");
  userSpeed.textContent = `Speed: ${userTeam.Pokemons[userCurrentIndex].Speed}`;
  const userTypes = document.getElementById("userTypes");
  userTeam.Pokemons[userCurrentIndex].Types.forEach((type) => {
    const typeLI = document.createElement("li");
    typeLI.textContent = type;
    userTypes.appendChild(typeLI);
  });

  //change dialog
  const userDialog = document.getElementById("userDialogText");
  userDialog.textContent = `What will ${userTeam.Pokemons[userCurrentIndex].Name} Do`;
};

await getTeamFromQueryString();
await populatePokemonForBattle();

initializeWebSocket();
addMessageHandler(setupJoinGame);
addMessageHandler(setTeams);
addMessageHandler(UpdateUI);

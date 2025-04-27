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
  getWebSocket,
  initializeWebSocket,
  SendAction,
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

const UpdateUI = () => {
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

  const userDetails = document.getElementById("userDetails");
  userSprite.addEventListener("mouseover", (e) => {
    userDetails.style.display = "block";
  });
  userSprite.addEventListener("mouseout", (e) => {
    userDetails.style.display = "none";
  });

  const oponentDetails = document.getElementById("oponentDetails");
  oponentSprite.addEventListener("mouseover", (e) => {
    oponentDetails.style.display = "block";
  });
  oponentSprite.addEventListener("mouseout", (e) => {
    oponentDetails.style.display = "none";
  });

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
  oponentTypes.replaceChildren();
  oponentTeam.Pokemons[oponentCurrentIndex].Types.forEach((type) => {
    const typeLI = document.createElement("li");
    typeLI.textContent = type;
    typeLI.classList.add(type)
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
  userTypes.replaceChildren();
  userTeam.Pokemons[userCurrentIndex].Types.forEach((type) => {
    const typeLI = document.createElement("li");
    typeLI.textContent = type;
    typeLI.classList.add(type)
    userTypes.appendChild(typeLI);
  });

  //change dialog
  const userDialogText = document.getElementById("userDialogText");
  console.log(userDialogText);
  userDialogText.textContent = `What will ${userTeam.Pokemons[userCurrentIndex].Name} do?`;

  //switch pokemon button
  const switchButton = document.getElementById("switchButton");
  const userDialog = document.getElementById("userdialog");
  const mainOptions = document.getElementById("MainOptions");
  const switchPokemonDiv = document.getElementById("switchPokemonDiv");
  const selectMoveDiv = document.getElementById("selectMoveDiv");
  const goBackButton = document.getElementById("goBackButton");
  mainOptions.style.display = "flex";

  const switchPokemonLogic = () => {
    userDialog.style.display = "none";
    mainOptions.style.display = "none";
    switchPokemonDiv.style.display = "flex";
    switchPokemonDiv.replaceChildren();

    userTeam.Pokemons.forEach((pokemon, index) => {
      if (index != userCurrentIndex) {
        const newCard = renderSwitchCards(pokemon, userMedia[index], index);
        newCard.addEventListener("click", (e) => {
          if (pokemon.HP != 0) {
            console.log("switched pokemon", index);
            SendAction("switch", index);
            userDialog.style.display = "flex";
            userDialogText.textContent = "Waiting for oponent's Action";
            mainOptions.style.display = "none";
            switchPokemonDiv.style.display = "none";
            selectMoveDiv.style.display = "none";
            goBackButton.style.display = "none";
          }
        });
        switchPokemonDiv.appendChild(newCard);
      }
    });
  };
  //switch pokemon if defeated
  if (userTeam.Pokemons[userCurrentIndex].HP === 0) {
    switchPokemonLogic();
  }

  switchButton.addEventListener("click", (e) => {
    goBackButton.style.display = "block";
    switchPokemonLogic();
  });

  //select move button
  const fightButton = document.getElementById("fightButton");

  fightButton.addEventListener("click", (e) => {
    goBackButton.style.display = "block";
    userDialog.style.display = "none";
    mainOptions.style.display = "none";
    selectMoveDiv.style.display = "flex";
    selectMoveDiv.replaceChildren();

    userTeam.Pokemons[userCurrentIndex].Moves.forEach((move, index) => {
      const newCardMove = renderMoveCard(move);
      newCardMove.addEventListener("click", (e) => {
        if (move.PP > 0) {
          var audio = new Audio(userMedia[userCurrentIndex].cry);
          audio.volume = 0.1;
          audio.play();
          console.log("move sended", index);
          SendAction("move", index);
          userDialog.style.display = "flex";
          userDialogText.textContent = "Waiting for oponent's Action";
          mainOptions.style.display = "none";
          switchPokemonDiv.style.display = "none";
          selectMoveDiv.style.display = "none";
          goBackButton.style.display = "none";
        }
      });
      selectMoveDiv.appendChild(newCardMove);
    });
  });

  goBackButton.addEventListener("click", (e) => {
    userDialog.style.display = "flex";
    mainOptions.style.display = "flex";
    switchPokemonDiv.style.display = "none";
    selectMoveDiv.style.display = "none";
    goBackButton.style.display = "none";
  });
};

const renderSwitchCards = (pokemon, sprite) => {
  const card = document.createElement("div");
  card.classList.add("switchCard");

  if (pokemon.HP === 0) {
    card.classList.add("faintedPokemon");
  }

  const spriteForCard = document.createElement("img");
  spriteForCard.src = sprite.frontSprite;
  card.appendChild(spriteForCard);

  const switchCardInfo = document.createElement("div");
  switchCardInfo.classList.add("switchCardInfo");
  card.appendChild(switchCardInfo);

  const nameAndTypes = document.createElement("div");
  nameAndTypes.classList.add("nameAndTypes");
  switchCardInfo.appendChild(nameAndTypes);

  const name = document.createElement("h2");
  name.textContent = pokemon.Name;
  nameAndTypes.appendChild(name);

  const types = document.createElement("div");
  types.classList.add("types");
  nameAndTypes.appendChild(types);

  pokemon.Types.forEach((t) => {
    const type = document.createElement("p");
    type.textContent = t;
    types.appendChild(type);
  });

  const healthBar = document.createElement("div");
  healthBar.classList.add("healthBar");
  switchCardInfo.appendChild(healthBar);

  const healthPercentage = document.createElement("div");
  healthPercentage.classList.add("healthPercentage");
  healthPercentage.style.width = `${
    (pokemon.HP / pokemon.OriginalStats[0]) * 100
  }%`;
  healthBar.appendChild(healthPercentage);

  return card;
};

const renderMoveCard = (move) => {
  const card = document.createElement("div");
  card.classList.add("MoveCard");

  if (move.PP == 0) {
    card.classList.add("outOfPP");
  }

  const moveNameDiv = document.createElement("div");
  moveNameDiv.classList.add("MoveName");
  card.appendChild(moveNameDiv);

  const moveNameText = document.createElement("h2");
  moveNameText.classList.add("MoveNameText");
  moveNameText.textContent = move.Name;
  moveNameDiv.appendChild(moveNameText);

  const moveType = document.createElement("h2");
  moveType.classList.add("MoveType");
  moveType.textContent = move.Type;
  moveNameDiv.appendChild(moveType);

  const moveInfoDiv = document.createElement("div");
  moveInfoDiv.classList.add("MoveInfo");
  card.appendChild(moveInfoDiv);

  const Power = document.createElement("h2");
  Power.classList.add("Power");
  Power.textContent = `Power: ${move.Power}`;
  moveInfoDiv.appendChild(Power);

  const Accuracy = document.createElement("h2");
  Accuracy.classList.add("Accuracy");
  Accuracy.textContent = `Accuracy: ${move.Accuracy}`;
  moveInfoDiv.appendChild(Accuracy);

  const PP = document.createElement("h2");
  PP.classList.add("PP");
  PP.textContent = `PP: ${move.PP}/${move.BasePP}`;
  moveInfoDiv.appendChild(PP);

  const DamageClass = document.createElement("h2");
  DamageClass.classList.add("DamageClass");
  DamageClass.textContent = move.MoveClass;
  moveInfoDiv.appendChild(DamageClass);

  return card;
};

const handleGameOver = (data) => {
  window.location.replace(`gameOver.html?${data.winner}`);
};

if (sessionStorage.getItem("username") == null) {
  window.location.replace("login.html");
}

await getTeamFromQueryString();
await populatePokemonForBattle();
initializeWebSocket();

const currentSocket = getWebSocket();

currentSocket.addEventListener("message", async (event) => {
  const data = JSON.parse(event.data);
  console.log("Received message:", data);

  if (data.type == "gameOver") {
    currentSocket.close();
    handleGameOver(data);
  } else {
    setupJoinGame(data);
    await setTeams(data, UpdateUI);
  }
});

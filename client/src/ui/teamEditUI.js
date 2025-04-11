import {
  getPokemonDataForCards,
  getPokemonTeamData,
  setTeamEditing,
  populateTeam,
  getTeamEditing,
} from "../domain/teamEditDomain.js";
import {
  sendTeamToAPI,
  sendTeamToAPIWithId,
} from "../service/pokemonTeamService.js";

var teamId = 0;

const getTeamFromQueryString = async () => {
  const queryString = window.location.search.slice(1).split("&");
  if (queryString[6] != "") {
    teamId = queryString[6];
  }

  if (teamId != 0) {
    await setTeamEditing(teamId);
  }
  await populateTeam(queryString.slice(0, 6));
};

const generateInitialPokemonCards = () => {
  const finalTeamSlots = document.getElementById(
    "displayTeamContainer"
  ).children;
  for (var slot of finalTeamSlots) {
    const pokemonForSlot = getPokemonDataForCards().find(
      (p) => p.teamIndex == slot.id
    );
    slot.appendChild(createPokemonCard(pokemonForSlot));
  }
};

const createPokemonCard = (pokemon) => {
  const pokemonContainer = document.createElement("div");

  const CardDiv = document.createElement("div");
  CardDiv.classList.add("cardsSmallView");
  CardDiv.dataset.id = pokemon.id;
  pokemonContainer.appendChild(CardDiv);

  const name = document.createElement("h2");
  name.textContent = `(${pokemon.id}) ${pokemon.name}`;
  CardDiv.appendChild(name);

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprite;
  sprite.alt = "Pokemon sprite";
  CardDiv.appendChild(sprite);

  const types = document.createElement("ul");
  types.classList.add("Types");
  CardDiv.appendChild(types);

  pokemon.types.forEach((t) => {
    const type = document.createElement("li");
    type.textContent = t;
    types.appendChild(type);
  });

  //error message
  const errorMessage = document.createElement("p");
  errorMessage.id = `errorPokemon${pokemon.teamIndex}`;
  errorMessage.classList.add("errorMessage");
  pokemonContainer.appendChild(errorMessage);

  //create div for edit pokemon
  const editPokemonParametersContainer = document.createElement("div");
  editPokemonParametersContainer.classList.add("editPokemonContainer");
  editPokemonParametersContainer.id = `editContainer${pokemon.teamIndex}`;
  pokemonContainer.appendChild(editPokemonParametersContainer);
  editPokemonParametersContainer.style.display = "none";

  //abilities div
  const abilitesDiv = document.createElement("div");
  abilitesDiv.classList.add("abilitiesDiv");
  editPokemonParametersContainer.appendChild(abilitesDiv);

  const selectAbilityLabel = document.createElement("label");
  selectAbilityLabel.textContent = "select an ability for the pokemon";
  abilitesDiv.appendChild(selectAbilityLabel);

  const selectAbility = document.createElement("select");
  selectAbility.id = `selectAbilities${pokemon.teamIndex}`;
  abilitesDiv.appendChild(selectAbility);

  const optHidden = document.createElement("option");
  optHidden.style.display = "none";
  selectAbility.appendChild(optHidden);

  pokemon.abilities.forEach((a) => {
    const opt = document.createElement("option");
    opt.textContent = a.ability.name;
    selectAbility.appendChild(opt);
  });

  //moves div
  const movesDiv = document.createElement("div");
  movesDiv.classList.add("movesDiv");
  movesDiv.id = `movesDiv${pokemon.teamIndex}`;
  editPokemonParametersContainer.appendChild(movesDiv);

  const movesLabel = document.createElement("label");
  movesLabel.textContent = "select moves for the pokemon";
  movesDiv.appendChild(movesLabel);

  const selectMove1 = document.createElement("select");
  selectMove1.id = `selectMove1/${pokemon.teamIndex}`;
  movesDiv.appendChild(selectMove1);

  const selectMove2 = document.createElement("select");
  selectMove2.id = `selectMove2/${pokemon.teamIndex}`;
  movesDiv.appendChild(selectMove2);

  const selectMove3 = document.createElement("select");
  selectMove3.id = `selectMove3/${pokemon.teamIndex}`;
  movesDiv.appendChild(selectMove3);

  const selectMove4 = document.createElement("select");
  selectMove4.id = `selectMove4/${pokemon.teamIndex}`;
  movesDiv.appendChild(selectMove4);

  const selectMoves = [selectMove1, selectMove2, selectMove3, selectMove4];

  const createHiddenOption = () => {
    const optHiddenMove = document.createElement("option");
    optHiddenMove.style.display = "none";
    return optHiddenMove;
  };
  selectMoves.forEach((m) => m.appendChild(createHiddenOption()));

  pokemon.moves.forEach((a) => {
    const createOption = () => {
      const opt = document.createElement("option");
      opt.textContent = a.move.name;
      return opt;
    };
    selectMoves.forEach((m) => m.appendChild(createOption()));
  });

  //setup edit team
  if (teamId != 0) {
    const editTeam = getTeamEditing();
    selectAbility.value = editTeam[pokemon.teamIndex].ability;
    selectMoves.forEach((m, index) => {
      m.value = editTeam[pokemon.teamIndex].moves[index];
    });
  }

  //check up for select moves
  selectMoves.forEach((m) =>
    m.addEventListener("change", (e) => setupChangeMoveListener(e, selectMoves))
  );

  return pokemonContainer;
};

const setupChangeMoveListener = (e, selectMoves) => {
  selectMoves.forEach((m) => {
    if (m != e.target && m.value == e.target.value) {
      m.value = "";
    }
  });
};

const setupCardSwithListener = () => {
  const allCards = document.getElementById("displayTeamContainer").children;
  for (var c of allCards) {
    c.addEventListener("click", (e) => switchToEditPokemonMode(e));
  }
};

const switchToEditPokemonMode = (e) => {
  //swap from normal to expanded
  const cardClicked = e.currentTarget;
  const allCards = document.getElementById("displayTeamContainer").children;
  const container = document.getElementById("displayTeamContainer");
  const goBackButotn = document.getElementById("back");
  const goNextButton = document.getElementById("next");
  const teamView = document.getElementById("teamViewButton");
  const saveTeamButton = document.getElementById("saveTeam");

  goBackButotn.style.display = "block";
  goNextButton.style.display = "block";

  saveTeamButton.style.display = "none";

  container.classList.remove("displayTeamContainer");
  container.classList.add("displayTeamExpandedContainer");

  cardClicked.children[0].children[2].style.display = "flex";

  for (var c of allCards) {
    if (c.id != cardClicked.id) {
      c.style.display = "none";
    }
  }

  cardClicked.classList.add("cardExpanded");

  teamView.style.display = "block";
};

const setupTeamViewButton = () => {
  const teamView = document.getElementById("teamViewButton");
  const allCards = document.getElementById("displayTeamContainer").children;
  const container = document.getElementById("displayTeamContainer");
  const goBackButotn = document.getElementById("back");
  const goNextButton = document.getElementById("next");
  const saveTeamButton = document.getElementById("saveTeam");

  // swap from expanded to normal
  teamView.addEventListener("click", (e) => {
    for (var c of allCards) {
      c.classList.remove("cardExpanded");
      c.style.display = "flex";

      c.children[0].children[2].style.display = "none";
    }
    teamView.style.display = "none";

    goBackButotn.style.display = "none";
    goNextButton.style.display = "none";

    saveTeamButton.style.display = "block";

    container.style.display = "grid";
    container.classList.add("displayTeamContainer");
    container.classList.remove("displayTeamExpandedContainer");
  });
};

const switchCards = (allCards, direction, currentCard) => {
  const cards = Array.from(allCards);
  const newId = (parseInt(currentCard.id) + direction + 6) % 6;
  currentCard.classList.remove("cardExpanded");
  currentCard.style.display = "none";

  const newCard = cards[newId];
  newCard.style.display = "flex";
  newCard.children[0].children[2].style.display = "flex";
  newCard.classList.add("cardExpanded");
};

const setupArrowButtons = () => {
  const goBackButotn = document.getElementById("back");
  const goNextButton = document.getElementById("next");

  goBackButotn.addEventListener("click", (e) => {
    const allCards = document.getElementById("displayTeamContainer").children;
    const container = document.getElementById("displayTeamContainer");
    const currentCard = container.querySelector(".cardExpanded");
    switchCards(allCards, -1, currentCard);
  });

  goNextButton.addEventListener("click", (e) => {
    const allCards = document.getElementById("displayTeamContainer").children;
    const container = document.getElementById("displayTeamContainer");
    const currentCard = container.querySelector(".cardExpanded");
    switchCards(allCards, 1, currentCard);
  });
};

const setupSendEditedTeam = () => {
  const form = document.getElementById("teamForm");
  const abilitiesSelectors = [];
  const movesSelectors = [];
  const errorMessages = [];

  for (var i = 0; i < 6; i++) {
    abilitiesSelectors.push(document.getElementById(`selectAbilities${i}`));
    movesSelectors.push(
      Array.from(document.getElementById(`movesDiv${i}`).children).slice(1)
    );
    errorMessages.push(document.getElementById(`errorPokemon${i}`));
  }

  form.addEventListener("submit", (e) => {
    var formHasErrors = false;

    for (var i = 0; i < 6; i++) {
      var errorMessage = "";
      if (abilitiesSelectors[i].value == "") {
        errorMessage += "Ability missing. ";
        formHasErrors = true;
      }

      var missingMoves = 0;
      movesSelectors[i].forEach((select) => {
        if (select.value == "") {
          missingMoves++;
        }
      });

      if (missingMoves > 0) {
        errorMessage += `${missingMoves} missing moves`;
        formHasErrors = true;
      }

      errorMessages[i].textContent = errorMessage;
    }

    errorMessages.forEach((error) => {
      if (error.textContent != "") {
        error.style.display = "block";
      }
      setTimeout(() => {
        error.style.display = "none";
        error.textContent = "";
      }, 3000);
    });

    e.preventDefault();
    if (!formHasErrors) {
      var pokemonTeam = [];
      const pokeData = getPokemonDataForCards();
      for (var i = 0; i < 6; i++) {
        const movesUrl = [];
        movesSelectors[i].forEach((m) => {
          movesUrl.push(
            pokeData[i].moves.find((move) => move.move.name == m.value).move.url
          );
        });

        pokemonTeam.push({
          id: pokeData[i].id,
          ability: abilitiesSelectors[i].value,
          abilityURL: pokeData[i].abilities.find(
            (a) => a.ability.name == abilitiesSelectors[i].value
          ).ability.url,
          moves: movesSelectors[i].map((move) => move.value),
          movesURL: movesUrl,
        });
      }
      const user = sessionStorage.getItem("username");
      const email = sessionStorage.getItem("email");
      const owner = `${user}|${email}`;

      if (teamId != 0) {
        sendTeamToAPIWithId(pokemonTeam, teamId, owner);
      } else {
        sendTeamToAPI(pokemonTeam, owner);
      }

      console.log(pokemonTeam);
      console.log(`${user}|${email}`);

      setTimeout(() => {
        window.location.replace("homepage.html");
      }, 10000);
    }
  });
};

if (sessionStorage.getItem("username") == null) {
  window.location.replace("login.html");
}

await getTeamFromQueryString();
generateInitialPokemonCards();
setupCardSwithListener();
setupTeamViewButton();
setupArrowButtons();
setupSendEditedTeam();

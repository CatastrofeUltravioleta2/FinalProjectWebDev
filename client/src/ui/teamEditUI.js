import {
  getPokemonDataForCards,
  getPokemonTeamData,
  populateTeam,
} from "../domain/teamEditDomain.js";

const getTeamFromQueryString = async () => {
  const queryString = window.location.search.slice(1).slice(0, -1).split("&");
  await populateTeam(queryString);
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
  const CardDiv = document.createElement("div");
  CardDiv.classList.add("cardsSmallView");
  CardDiv.dataset.id = pokemon.id;

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

  return CardDiv;
};

const setupCardSwithListener = () => {
  const allCards = document.getElementById("displayTeamContainer").children;
  for (var c of allCards) {
    c.addEventListener("click", (e) => switchToEditPokemonMode(e));
  }
};

const switchToEditPokemonMode = (e) => {
  const cardClicked = e.currentTarget;
  const allCards = document.getElementById("displayTeamContainer").children;
  const container = document.getElementById("displayTeamContainer");
  const goBackButotn = document.getElementById("back");
  const goNextButton = document.getElementById("next");
  const teamView = document.getElementById("teamViewButton");
  var currentCard = cardClicked;

  goBackButotn.style.display = "block";
  goNextButton.style.display = "block";

  container.classList.remove("displayTeamContainer");
  container.classList.add("displayTeamExpandedContainer");

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

  teamView.addEventListener("click", (e) => {
    for (var c of allCards) {
      c.classList.remove("cardExpanded");
      c.style.display = "flex";
    }
    teamView.style.display = "none";

    goBackButotn.style.display = "none";
    goNextButton.style.display = "none";

    container.style.display = "grid";
    container.classList.add("displayTeamContainer");
    container.classList.remove("displayTeamExpandedContainer");
  });
};

const switchCards = (allCards, direction, currentCard) => {
  const cards = Array.from(allCards);
  const newId = (parseInt(currentCard.id) + direction + 6) % 6;
  console.log(newId)
  currentCard.classList.remove("cardExpanded");
  currentCard.style.display = "none";

  const newCard = cards[newId];
  newCard.style.display = "flex";
  newCard.classList.add("cardExpanded");
};

const setupArrowButtons = () => {
  const allCards = document.getElementById("displayTeamContainer").children;
  const container = document.getElementById("displayTeamContainer");
  const currentCard = container.querySelector(".cardExpanded");
  const goBackButotn = document.getElementById("back");
  const goNextButton = document.getElementById("next");


  goBackButotn.addEventListener("click", (e) => {
    const allCards = document.getElementById("displayTeamContainer").children;
    const container = document.getElementById("displayTeamContainer");
    const currentCard = container.querySelector(".cardExpanded");
    console.log(currentCard);
    switchCards(allCards, -1, currentCard);
  });

  goNextButton.addEventListener("click", (e) => {
    const allCards = document.getElementById("displayTeamContainer").children;
    const container = document.getElementById("displayTeamContainer");
    const currentCard = container.querySelector(".cardExpanded");
    console.log(currentCard);
    switchCards(allCards, 1, currentCard);
  });
};

await getTeamFromQueryString();
generateInitialPokemonCards();
setupCardSwithListener();
setupTeamViewButton();
setupArrowButtons();

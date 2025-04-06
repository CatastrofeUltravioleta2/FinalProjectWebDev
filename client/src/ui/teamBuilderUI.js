import {
  addPokemonToTeam,
  getAmountInTeam,
  getPokemonById,
  getPokemonListDisplay,
  removePokemonFromTeam,
} from "../domain/teamBuilderDomain.js";

const createPokemonCard = (pokemon) => {
  const CardDiv = document.createElement("div");
  if (pokemon.onTeam == false) {
    CardDiv.classList.add("pokemonCard");
  } else {
    CardDiv.classList.add("pokemonCardonTeam");
  }
  CardDiv.addEventListener("click", (e) => {
    window.location.replace(`pokedexEntry.html?${pokemon.id}`);
  });

  CardDiv.dataset.id = pokemon.id;
  CardDiv.draggable = true;
  CardDiv.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", `${pokemon.id}|${pokemon.onTeam}`);
  });

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

const renderPokemonCard = (pokemonList) => {
  const container = document.getElementById("pokemonCardContainer");
  container.replaceChildren();

  pokemonList.forEach((p) => {
    container.appendChild(createPokemonCard(p));
  });
};

const setupFilter = () => {
  const nameInput = document.getElementById("pokemonNameFilter");
  const type1Filter = document.getElementById("pokemonType1Filter");
  const type2Filter = document.getElementById("pokemonType2Filter");
  const idFilter = document.getElementById("pokemonIdFilter");

  idFilter.addEventListener("input", (e) => {
    filterPokemon();
  });
  nameInput.addEventListener("input", (e) => {
    filterPokemon();
  });

  type1Filter.addEventListener("change", (e) => {
    filterPokemon();
  });

  type2Filter.addEventListener("change", (e) => {
    filterPokemon();
  });
};

const filterPokemon = () => {
  const nameInput = document.getElementById("pokemonNameFilter");
  const type1Filter = document.getElementById("pokemonType1Filter");
  const type2Filter = document.getElementById("pokemonType2Filter");
  const idFilter = document.getElementById("pokemonIdFilter");

  const pokemonList = getPokemonListDisplay();
  var filteredPokemon = [];

  filteredPokemon = pokemonList.filter((p) => {
    return (
      p.name.toLowerCase().includes(nameInput.value.toLowerCase()) &&
      (p.types[0]?.includes(type1Filter.value.toLowerCase()) ||
        p.types[1]?.includes(type1Filter.value.toLowerCase())) &&
      (p.types[0]?.includes(type2Filter.value.toLowerCase()) ||
        p.types[1]?.includes(type2Filter.value.toLowerCase())) &&
      (idFilter.value == "" || p.id == idFilter.value)
    );
  });

  renderPokemonCard(filteredPokemon);
};

const setupDropTeam = () => {
  const dropItems = document.getElementById("dragPokemonContainer").children;
  for (var teamSlot of dropItems) {
    teamSlot.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    teamSlot.addEventListener("drop", (e) => {
      const transferInfo = e.dataTransfer.getData("text/plain");
      const pokemonId = transferInfo.split("|")[0];
      const onTeam = transferInfo.split("|")[1];
      const pokemonDraggedInfo = getPokemonById(pokemonId);

      if (
        onTeam == "false" &&
        getAmountInTeam() < 6 &&
        e.currentTarget.childElementCount == 0
      ) {
        addPokemonToTeam(pokemonDraggedInfo);
        e.target.appendChild(createPokemonCard(pokemonDraggedInfo));
        renderPokemonCard(getPokemonListDisplay());
      }
      else if (getAmountInTeam() == 6) {
        const errorMessage = document.getElementById("teamError");
        errorMessage.textContent = "Team cannot contain more than 6 pokemon";
        errorMessage.style.display = "block";

        setTimeout(() => {
          errorMessage.textContent = "";
          errorMessage.style.display = "none";
        }, 3000);
      }
    });
  }
};

const setupDropNotOnTeam = () => {
  const pokemonContainer = document.getElementById("pokemonCardContainer");
  pokemonContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  pokemonContainer.addEventListener("drop", (e) => {
    const transferInfo = e.dataTransfer.getData("text/plain");
    const pokemonId = transferInfo.split("|")[0];
    const onTeam = transferInfo.split("|")[1];

    if (onTeam == "true" && getAmountInTeam() >= 0) {
      const pokemonDraggedInfo = getPokemonById(pokemonId);
      removePokemonFromTeam(pokemonDraggedInfo);
      renderPokemonCard(getPokemonListDisplay());

      const dropItems = document.getElementById(
        "dragPokemonContainer"
      ).children;
      for (var teamSlot of dropItems) {
        if (teamSlot.childNodes[0]?.dataset.id == pokemonId) {
          teamSlot.replaceChildren();
        }
      }
    }
  });
};

const setupSendTeam = () => {
  const sendButton = document.getElementById("sendTeamButton");
  sendButton.addEventListener("click", (e) => {
    if (getAmountInTeam() != 6) {
      const errorMessage = document.getElementById("teamError");
      errorMessage.textContent = "Team must have 6 pokemon";
      errorMessage.style.display = "block";

      setTimeout(() => {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
      }, 3000);
    } else {

      var ids = ""
      const dropItems = document.getElementById(
        "dragPokemonContainer"
      ).children;
      for (var teamSlot of dropItems) {
        ids += `${teamSlot.childNodes[0].dataset.id}&`
      }

      window.location.replace(`teamEdit.html?${ids}`);
    }
  });
};

renderPokemonCard(getPokemonListDisplay());
setupFilter();
setupDropTeam();
setupDropNotOnTeam();
setupSendTeam();

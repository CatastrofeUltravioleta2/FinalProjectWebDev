import { getPokemonListDisplay } from "../domain/teamBuilderDomain.js";

const createPokemonCard = (pokemon) => {
  const CardDiv = document.createElement("div");
  CardDiv.classList.add("pokemonCard");
  CardDiv.addEventListener("click", (e) => {
    window.location.replace(`pokedexEntry.html?${pokemon.id}`)
  })

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

renderPokemonCard(getPokemonListDisplay());
setupFilter();

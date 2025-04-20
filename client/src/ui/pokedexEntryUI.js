import { getAllAbilities } from "../domain/teamEditDomain.js";
import {
  getMoveData,
  getPokemonDataFromId,
} from "../service/pokemonAPIservice.js";

const getIdFromQueryString = async () => {
  const queryString = window.location.search.slice(1);
  const pokeData = await getPokemonDataFromId(queryString);
  console.log(pokeData);
  await renderPokemonInfo(pokeData);

  var audio = new Audio(pokeData.cries.latest);
  audio.volume = 0.1;
  audio.play();
};
const renderPokemonInfo = async (pokemonData) => {
  const pokemonInfoContainer = document.getElementById("PokemonInfo");
  pokemonInfoContainer.replaceChildren();

  const mainHeaderInfo = document.createElement("div");
  mainHeaderInfo.id = "mainHeaderInfo";
  pokemonInfoContainer.appendChild(mainHeaderInfo);

  //Display image and name
  const imageAndName = document.createElement("div");
  imageAndName.id = "imageAndName";
  mainHeaderInfo.appendChild(imageAndName);

  const image = document.createElement("img");
  image.src = pokemonData.sprites.front_default;
  imageAndName.appendChild(image);

  const nameAndType = document.createElement("div");
  imageAndName.appendChild(nameAndType);

  const name = document.createElement("h2");
  name.textContent = `(${pokemonData.id}) ${pokemonData.name}`;
  nameAndType.appendChild(name);

  pokemonData.types.forEach((t) => {
    const type = document.createElement("h2");
    type.classList.add("type");
    type.textContent = t.type.name;
    nameAndType.appendChild(type);
  });

  //display stat data

  const statsUl = document.createElement("ul");
  statsUl.id = "stats";
  mainHeaderInfo.appendChild(statsUl);
  var statTotal = 0;

  pokemonData.stats.forEach((stat) => {
    const li = document.createElement("li");
    li.classList.add("stat");
    li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
    statTotal += stat.base_stat;
    statsUl.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = `Total: ${statTotal}`;
  statsUl.appendChild(totalLi);

  //display other info
  const OtherInfo = document.createElement("div");
  OtherInfo.id = "OtherInfo";
  pokemonInfoContainer.appendChild(OtherInfo);

  //display abilities
  const abilitiesUl = document.createElement("ul");
  abilitiesUl.id = "Abilities";
  OtherInfo.appendChild(abilitiesUl);

  var allAbilities = getAllAbilities();
  allAbilities.forEach((a) => {
    const li = document.createElement("li");
    li.classList.add("ability");
    li.textContent = a.name;
    abilitiesUl.appendChild(li);
  });

  //display moves
  const movesUl = document.createElement("ul");
  movesUl.id = "Moves";
  OtherInfo.appendChild(movesUl);

  const firstGenMoves = await selectMoves(pokemonData.moves);
  console.log(firstGenMoves);
  firstGenMoves.forEach((m) => {
    const li = document.createElement("li");
    li.classList.add("move");
    li.textContent = m.move.name;
    movesUl.appendChild(li);
  });
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
await getIdFromQueryString();

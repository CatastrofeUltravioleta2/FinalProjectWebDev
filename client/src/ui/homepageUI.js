import { getPokemonDataFromId } from "../service/pokemonAPIservice.js";
import {
  getAllTeams,
  getAllTeamsByOwner,
} from "../service/pokemonTeamService.js";

const displaySavedTeams = async () => {
  const savedTeamsDiv = document.getElementById("SavedTeams");
  savedTeamsDiv.replaceChildren();

  const user = sessionStorage.getItem("username");
  const email = sessionStorage.getItem("email");

  const teams = await getAllTeamsByOwner(`${user}|${email}`);
  if (!teams || teams.length === 0) {
    savedTeamsDiv.textContent =
      "No teams saved. \n To join a game you need to create a team";
    return;
  }

  const savedTeamsTitle = document.createElement("h1");
  savedTeamsTitle.textContent = `${sessionStorage.getItem("username")} Teams`;
  savedTeamsDiv.appendChild(savedTeamsTitle);

  teams.forEach((team, teamIndex) => {
    const JoinGameButton = document.createElement("button");
    JoinGameButton.textContent = "Join a Game";
    savedTeamsDiv.appendChild(JoinGameButton);

    JoinGameButton.addEventListener("click", (e) => {
      window.location.replace(`lobby.html?${team.teamId}`);
    });

    const teamContainer = document.createElement("div");
    teamContainer.classList.add("teamContainer");

    const teamTitle = document.createElement("h2");
    teamTitle.textContent = `Team ${teamIndex + 1}`;
    teamContainer.appendChild(teamTitle);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit team";
    teamContainer.appendChild(editButton);
    editButton.addEventListener("click", (e) => {
      var ids = "";
      team.pokemons.forEach((p) => {
        ids += `${p.id}&`;
      });
      window.location.replace(`teamEdit.html?${ids}${team.teamId}`);
    });

    const pokemonTeamContainer = document.createElement("div");
    pokemonTeamContainer.classList.add("pokemonTeamContainer");
    teamContainer.appendChild(pokemonTeamContainer);

    team.pokemons.forEach(async (pokemonInfo) => {
      const pokemonData = await getPokemonDataFromId(pokemonInfo.id);

      const pokemonCard = document.createElement("div");
      pokemonCard.classList.add("pokemonCard");

      const sprite = document.createElement("img");
      sprite.src = pokemonData.sprites.front_default;
      sprite.alt = pokemonData.name;
      pokemonCard.appendChild(sprite);

      const name = document.createElement("h3");
      name.textContent = `(${pokemonData.id}) ${pokemonData.name}`;
      pokemonCard.appendChild(name);

      const typesList = document.createElement("ul");
      pokemonData.types.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t.type.name;
        typesList.appendChild(li);
      });
      pokemonCard.appendChild(typesList);

      const ability = document.createElement("p");
      ability.textContent = `Ability: ${pokemonInfo.ability}`;
      pokemonCard.appendChild(ability);

      const moves = document.createElement("p");
      moves.textContent = `Moves: ${pokemonInfo.moves.join(", ")}`;
      pokemonCard.appendChild(moves);

      pokemonTeamContainer.appendChild(pokemonCard);
    });

    savedTeamsDiv.appendChild(teamContainer);
  });
};

if (sessionStorage.getItem("username") == null) {
  window.location.replace("login.html");
}
await displaySavedTeams();

const user = sessionStorage.getItem("username");
const email = sessionStorage.getItem("email");
console.log(`${user}|${email}`);
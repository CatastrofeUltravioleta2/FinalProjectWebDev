import { getPokemonDataFromId } from "../service/pokemonAPIservice.js";
import { getAllTeams } from "../service/pokemonTeamService.js";

const displaySavedTeams = async () => {
  const savedTeamsDiv = document.getElementById("SavedTeams");
  savedTeamsDiv.replaceChildren();

  const teams = await getAllTeams();
  if (!teams || teams.length === 0) {
    savedTeamsDiv.textContent = "No teams saved.";
    return;
  }

  teams.forEach((team, teamIndex) => {
    const teamContainer = document.createElement("div");
    teamContainer.classList.add("teamContainer");

    const teamTitle = document.createElement("h2");
    teamTitle.textContent = `Team ${teamIndex + 1}`;
    teamContainer.appendChild(teamTitle);

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

await displaySavedTeams();

import { populateCurrentTeamLobby, populatePokemonForBattle } from "../domain/lobbyDomain.js";
import { getTeamById } from "../service/pokemonTeamService.js";

const getTeamFromQueryString = async () => {
  const queryString = window.location.search.slice(1);
  populateCurrentTeamLobby(await getTeamById(queryString));
};
await getTeamFromQueryString();
populatePokemonForBattle();



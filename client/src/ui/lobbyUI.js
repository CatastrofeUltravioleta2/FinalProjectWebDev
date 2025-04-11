import { populateCurrentTeamLobby, populatePokemonForBattle } from "../domain/lobbyDomain.js";
import { SetupConnection } from "../service/lobbyService.js";
import { getTeamById } from "../service/pokemonTeamService.js";

const getTeamFromQueryString = async () => {
  const queryString = window.location.search.slice(1);
  populateCurrentTeamLobby(await getTeamById(queryString));
};

const setupJoinGame = (connectionResponse) => {
  const displayResponse = document.getElementById("connectionResponse");

  console.log(connectionResponse)
  console.log(Object.keys(connectionResponse).length)
  if(Object.keys(connectionResponse).length != 0)
  {
    if(connectionResponse.type == "userStatus")
    {
      displayResponse.textContent = connectionResponse.message;
    }
    else if(connectionResponse.type == "joinGame")
    {
      displayResponse.textContent = `${connectionResponse.message} // gameId: ${connectionResponse.gameId}`
    }
  }
}

await getTeamFromQueryString();
await populatePokemonForBattle();
SetupConnection(setupJoinGame);



const apiAdress = "http://localhost:5176";

export const sendTeamToAPI = async (pokemons, owner) => {
  
  const TeamInfo = {
    Pokemons: pokemons,
    teamId: Date.now(),
    owner: owner,
  };

  console.log(TeamInfo)
  await fetch(`${apiAdress}/Teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(TeamInfo),
  });
};

export const sendTeamToAPIWithId = async (pokemons, id, owner) => {
  const TeamInfo = {
    Pokemons: pokemons,
    teamId: id,
    owner: owner,
  };

  await fetch(`${apiAdress}/Teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(TeamInfo),
  });
};
export const getAllTeams = async () => {
  const response = await fetch(`${apiAdress}/Teams`, {
    method: "GET",
  });
  return await response.json();
};

export const getAllTeamsByOwner = async (owner) => {

  const response = await fetch(`${apiAdress}/Teams`, {
    method: "GET",
  });
  const allTeams =  await response.json();
  return allTeams.filter(team => team.owner == owner)
};

export const getTeamById = async (id) => {
  const response = await fetch(`${apiAdress}/Teams/${id}`, {
    method: "GET",
  });
  return await response.json();
};

const apiAdress = "http://localhost:5176";

export const sendTeamToAPI = async (pokemons) => {
  const TeamInfo = {
    Pokemons: pokemons,
    teamId: Date.now(),
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

export const getTeamById = async (id) => {
    const response = await fetch(`${apiAdress}/Teams/${id}`, {
        method: "GET",
      });
      return await response.json();
}
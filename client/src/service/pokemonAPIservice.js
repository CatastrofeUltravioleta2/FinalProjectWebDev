export const getAllPokemon = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`, {
    method: "GET",
  });
  const data = await response.json();
  return await data.results;
};

export const getPokemonData = async (url) => {
  const response = await fetch(url, {
    method: "GET",
  });
  return await response.json();
};

export const getPokemonDataFromId = async (id) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    method: "GET",
  });
  return await response.json();
};

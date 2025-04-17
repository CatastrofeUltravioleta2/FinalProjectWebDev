namespace Records;
public record userAccount(string username, string email, int age, string region);
public record pokemonTeam(pokemon[] Pokemons, long teamId, string owner);
public record pokemon(int id, string ability, string abilityURL, string[] moves, string[] movesURL);
public record userIndetification(string type, string userData, List<pokemonBattle> team);
public record userAction(string actionType, int index);
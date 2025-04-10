namespace GameLogic;

public static class Lobby
{
    static private Dictionary<Guid, Game> AllGames {get;set;} = new Dictionary<Guid, Game>();
    public static Guid CreateGame() 
    {
        Guid gameId = Guid.NewGuid();
        Game newGame = new Game(gameId);
        AllGames[gameId] = newGame;
        return gameId;
    }
    public static Game? GetGameById(Guid id)
    {
        return AllGames.ContainsKey(id) ? AllGames[id] : null;
    }
    public static Guid JoinGame(Player player1, Player player2)
    {
        var currentGameId = CreateGame();
        AllGames[currentGameId].Player1 = player1;
        AllGames[currentGameId].Player2 = player2;
        return currentGameId;
    }
}
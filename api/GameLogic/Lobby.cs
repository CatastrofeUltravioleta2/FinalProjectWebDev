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

    //returns guid or null finds game of player
    public static Guid GetGameIdByPlayer(string playerId)
    {
        foreach(var game in AllGames.Values)
        {
            if(game.Player1?.Info == playerId || game.Player2?.Info == playerId)
                return game.Id;
        }
        return default;
    }
    public static Guid JoinGame(Player player1, Player player2)
    {
        var currentGameId = CreateGame();
        AllGames[currentGameId].Player1 = player1;
        AllGames[currentGameId].Player2 = player2;
        return currentGameId;
    }
}
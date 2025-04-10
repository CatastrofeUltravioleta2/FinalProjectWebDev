namespace GameLogic;

public static class Lobby
{
    static private Dictionary<Guid, Game> AllGames {get;set;}
    public static Guid CreateGame() 
    {
        Game newGame = new Game();
        Guid gameId = Guid.NewGuid();
        AllGames[gameId] = newGame;
        return gameId;
    }
    public static Game? GetGameById(Guid id)
    {
        return AllGames.ContainsKey(id) ? AllGames[id] : null;
    }
    public static bool JoinGame(Guid id, Player player)
    {
        var currentGame = GetGameById(id);
        if(currentGame is null)
        {
            return false;
        }
        if(currentGame.isFull)
        {
            return false;
        }

        if(currentGame.Player1 is null)
        {
            currentGame.Player1 = player;
        }
        else
        {
            currentGame.Player2 = player;
        }
        return true;
    }
}
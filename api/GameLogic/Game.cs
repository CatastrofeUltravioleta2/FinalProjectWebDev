public class Game
{
    public Guid Id { get; }
    public Player? Player1 { get; set; } = null;
    public Player? Player2 { get; set; } = null;
    public Player currentPlayer { get; set; }
    public bool isFull => Player1 is not null && Player2 is not null;

    public Game(Guid id)
    {
        Id = id;
    }

}
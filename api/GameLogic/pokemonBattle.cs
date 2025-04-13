public class pokemonBattle
{
    public int Id { get; set; }
    public List<string> Types { get; set; }
    public string Name { get; set; }
    public List<int> OriginalStats { get; set; }
    public int HP { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
    public int SpecialAttack { get; set; }
    public int SpecialDefense { get; set; }
    public int Speed { get; set; }
    public List<Move> Moves { get; set; } = new List<Move>();
    public Ability Ability { get; set; }

    public pokemonBattle(int id, List<string> types, string name, List<int> originalStats, int hp, int attack, int defense, int specialAttack, int specialDefense, int speed, List<Move> moves, Ability ability)
    {
        Id = id;
        Types = types;
        Name = name;
        OriginalStats = originalStats;
        HP = hp;
        Attack = attack;
        Defense = defense;
        SpecialAttack = specialAttack;
        SpecialDefense = specialDefense;
        Speed = speed;
        Moves = moves;
        Ability = ability;
    }

    public override string ToString()
    {
        string typesStr = string.Join(", ", Types);
        string movesStr = string.Join(", ", Moves.Select(m => m.Name));
        string abilityStr = $"{Ability.Name} - {Ability.Effect}";
        string originalStatsStr = string.Join(", ", OriginalStats);

        return $"Pokemon: {Name} (ID: {Id})\n" +
               $"Types: {typesStr}\n" +
               $"Original Base Stats: {originalStatsStr}\n" +
               $"Calculated Stats: HP: {HP}, Attack: {Attack}, Defense: {Defense}, Special Attack: {SpecialAttack}, Special Defense: {SpecialDefense}, Speed: {Speed}\n" +
               $"Moves: {movesStr}\n" +
               $"Ability: {abilityStr}";
    }
}
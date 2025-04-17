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
    public bool IsFainted => HP <= 0;
    public bool ModifyStat(int modifier, int statIndex)
    {
        (int originalStat, int effectiveStat) = statIndex switch
        {
            1 => (OriginalStats[1], Attack),
            2 => (OriginalStats[2], Defense),
            3 => (OriginalStats[3], SpecialAttack),
            4 => (OriginalStats[4], SpecialDefense),
            5 => (OriginalStats[5], Speed),
        };
        int stage;
        if (effectiveStat > originalStat)
            stage = (int)2 * (effectiveStat / originalStat) - 2;
        else if (effectiveStat < originalStat)
            stage = (int)(2 - (2 * originalStat / effectiveStat));
        else
            stage = 0;
        int currentStage = stage + modifier;
        double multiplier = 1;

        if (currentStage >= 0)
            multiplier = (2 + currentStage) / 2.0;
        else
            multiplier = 2.0 / (2.0 - currentStage);

        if (currentStage > 6 || currentStage < -6)
            return false;
        else
        {
            switch (statIndex)
            {
                case 1:
                    Attack = (int)Math.Floor(OriginalStats[1] * multiplier);
                    return true;
                case 2:
                    Defense = (int)Math.Floor(OriginalStats[2] * multiplier);
                    return true;
                case 3:
                    SpecialAttack = (int)Math.Floor(OriginalStats[3] * multiplier);
                    return true;
                case 4:
                    SpecialDefense = (int)Math.Floor(OriginalStats[4] * multiplier);
                    return true;
                case 5:
                    SpecialAttack = (int)Math.Floor(OriginalStats[5] * multiplier);
                    return true;
                default:
                    return false;

            }

        }

    }
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
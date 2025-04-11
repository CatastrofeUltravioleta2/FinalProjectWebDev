public class pokemonBattle
{
    public int Id { get; set; }
    public List<string> Types {get; set;}
    public string Name { get; set; }
    public int HP { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
    public int SpecialAttack { get; set; }
    public int SpecialDefense { get; set; }
    public int Speed { get; set; }
    public List<Move> Moves { get; set; } = new List<Move>();
    public Ability Ability { get; set; }

    public pokemonBattle(int id, List<string> types, string name, int hp, int attack, int defense, int specialAttack, int specialDefense, int speed, List<Move> moves, Ability ability)
    {
        Id = id;
        Types = types;
        Name = name;
        HP = hp;
        Attack = attack;
        Defense = defense;
        SpecialAttack = specialAttack;
        SpecialDefense = specialDefense;
        Speed = speed;
        Moves = moves;
        Ability = ability;
    }
}
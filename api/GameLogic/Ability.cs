public class Ability
{
    public string Name {get; set;}
    public string Effect {get; set;}
    public Ability(string name, string effect)
    {
        Name = name;
        Effect = effect;
    }
}
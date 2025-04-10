public class Move
{
    public string Name { get; }
    public int Power { get; set; }
    public int Accuracy { get; set; }
    public int PP {get;set;}
    public string MoveClass {get;set;}
    public Type Type { get; }
    // status moves or other
    public Move(string name, int power, int accuracy, Type type, int pp, string moveClass)
    {
        Name = name;
        Power = power;
        Accuracy = accuracy;
        Type = type;
        PP = pp;
        MoveClass = moveClass;
    }
}
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

public interface IAbility
{
    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move);
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move);
    public void StatModifiers (pokemonBattle attacker, pokemonBattle defender, Move move);

}

public class SpeedBoost : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        attacker.ModifyStat(1, 5);
    }
}

public class Sturdy : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        throw new NotImplementedException();
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        throw new NotImplementedException();
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        throw new NotImplementedException();
    }
}
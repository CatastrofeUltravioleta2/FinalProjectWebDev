public class Ability
{
    public string Name { get; set; }
    public string Effect { get; set; }
    public IAbility ability {get;set;}
    public Ability(string name, string effect)
    {
        Name = name;
        Effect = effect;
        ability = name switch 
        {
            "speed boost" => new SpeedBoost(),
            "sturdy"        => new Sturdy(),
            "overgrow"      => new Overgrow(),
            "blaze"         => new Blaze(),
            "torrent"       => new Torrent(),
            "swarm"         => new Swarm(),
            "tinted lens"   => new TintedLens(),
            "intimidate"    => new Intimidate(),
            "technician"    => new Technician(),
            "justified"     => new Justified(),
            "water absorb"  => new WaterAbosrb(),
            "analytic"      => new Analytic(),
            "thick fat"     => new ThickFat(),
            "levitate"      => new Levitate(),
            "weak armor"    => new WeakArmor(),
            "aftermath"     => new Aftermath(),
            "filter"        => new Filter(),
            "moxie"         => new Moxie(),
            
        };
    }
}

public interface IAbility
{
    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move);
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move);
    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move);

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
        if (defender.HP == defender.OriginalStats[0])
        {
            if (baseDamageDealt >= defender.HP)
            {
                return defender.HP - 1;
            }
        }
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

public abstract class LowHPBoostAbilities : IAbility
{
    private string _type;
    protected LowHPBoostAbilities(string type) => _type = type;
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        if (move.Type == _type
         && attacker.HP <= attacker.OriginalStats[0] / 3)
            return baseDamageDealt * 1.5;
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

public class Overgrow : LowHPBoostAbilities { public Overgrow() : base("grass") { } }
public class Blaze : LowHPBoostAbilities { public Blaze() : base("fire") { } }
public class Torrent : LowHPBoostAbilities { public Torrent() : base("water") { } }
public class Swarm : LowHPBoostAbilities { public Swarm() : base("bug") { } }

//Double not very effective moves
public class TintedLens : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        double TypeEffectiveness = 1;
        foreach (var type in defender.Types)
        {
            if (TypeChartDisplay.TypeChart[move.Type].ContainsKey(type))
                TypeEffectiveness *= TypeChartDisplay.TypeChart[move.Type][type];
        }
        if (TypeEffectiveness < 1) return baseDamageDealt * 2;
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//Intimidate -1 Attack
public class Intimidate : IAbility
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
        defender.ModifyStat(-1, 1);
    }
}

//Technician: boost <= 60 power moves x1.5
public class Technician : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return (move.Power <= 60 && move.Type != "status") ? baseDamageDealt * 1.5 : baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//+1 attack if hit by dark
public class Justified : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        if (move.Type == "dark") defender.ModifyStat(1, 1);
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//water absorb: Absorbs water moves, healing for 1/4 max HP.
public class WaterAbosrb : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        if (move.Type == "water")
        {
            defender.HP = Math.Min(defender.OriginalStats[0], defender.HP + defender.OriginalStats[0] / 4);
            return 0;
        }
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//- analytic: Strengthens moves to 1.3× their power when moving last.
public class Analytic : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return attacker.Speed < defender.Speed ? baseDamageDealt * 1.3 : baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//thick-fat: Halves damage from fire and ice moves.
public class ThickFat : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return (move.Type == "fire" || move.Type == "ice") ? baseDamageDealt * 0.5 : baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//levitate: Evades ground moves.
public class Levitate : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return move.Type == "ground" ? 0 : baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//- weak-armor: Raises Speed and lowers Defense by one stage each upon being hit by a physical move.
public class WeakArmor : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        if (move.MoveClass == "physical")
        {
            defender.ModifyStat(1, 5);
            defender.ModifyStat(-1, 2);
        }
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//- aftermath: Damages the attacker for 1/4 its max HP when knocked out by a contact move.
public class Aftermath : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        if (baseDamageDealt >= defender.HP)
            attacker.HP = Math.Max(1, attacker.HP - attacker.OriginalStats[0] / 4);
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move) { }
}

//filter: Decreases damage taken from super-effective moves by 1/4.
public class Filter : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        double TypeEffectiveness = 1;
        foreach (var type in defender.Types)
        {
            if (TypeChartDisplay.TypeChart[move.Type].ContainsKey(type))
                TypeEffectiveness *= TypeChartDisplay.TypeChart[move.Type][type];
        }
        if(TypeEffectiveness > 1) return baseDamageDealt * 0.75;
        return baseDamageDealt;

    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move){}
}

//moxie: Raises Attack one stage upon KOing a Pokémon.
public class Moxie : IAbility
{
    public double DamagaReceivedModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        return baseDamageDealt;
    }

    public double DamageModifier(double baseDamageDealt, pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        if(baseDamageDealt >= defender.HP)
            attacker.ModifyStat(1, 1);
        return baseDamageDealt;
    }

    public void StatModifiers(pokemonBattle attacker, pokemonBattle defender, Move move){}
}


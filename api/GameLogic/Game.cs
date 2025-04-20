using System.Security.Cryptography.X509Certificates;

public class Game
{
    public Guid Id { get; }
    public Player? Player1 { get; set; } = null;
    public Player? Player2 { get; set; } = null;
    public Player currentPlayer { get; set; }
    Random random = new Random();
    public bool isFull => Player1 is not null && Player2 is not null;

    public Game(Guid id)
    {
        Id = id;
    }
    public void ReceiveAction(string actionPlayer1, int indexPlayer1, string actionPlayer2, int indexPlayer2)
    {
        if (actionPlayer1 == "switch")
        {
            System.Console.WriteLine($"switching {indexPlayer1} player 1");
            Player1.Team.SwticActivePokemon(indexPlayer1);
        }
        if (actionPlayer2 == "switch")
        {
            System.Console.WriteLine($"switching {indexPlayer2} player 2");
            Player2.Team.SwticActivePokemon(indexPlayer2);
        }

        System.Console.WriteLine("calculating damage");
        pokemonBattle activePokemon1 = Player1.Team.ActivePokemmon();
        pokemonBattle activePokemon2 = Player2.Team.ActivePokemmon();

        activePokemon1.Ability.ability.StatModifiers(activePokemon1, activePokemon2, null);
        activePokemon1.Ability.ability.StatModifiers(activePokemon2, activePokemon1, null);

        bool pokemon1Attacking = actionPlayer1 == "move" && !activePokemon1.IsFainted;
        bool pokemon2Attacking = actionPlayer2 == "move" && !activePokemon2.IsFainted;

        if (pokemon1Attacking && !pokemon2Attacking)
        {
            ApplyMove(activePokemon1, activePokemon2, activePokemon1.Moves[indexPlayer1]);
        }
        else if (!pokemon1Attacking && pokemon2Attacking)
        {
            ApplyMove(activePokemon2, activePokemon1, activePokemon2.Moves[indexPlayer2]);
        }
        else if (pokemon1Attacking && pokemon2Attacking)
        {
            Move movePlayer1 = activePokemon1.Moves[indexPlayer1];
            Move movePlayer2 = activePokemon2.Moves[indexPlayer2];

            if (activePokemon1.Speed > activePokemon2.Speed)
            {
                ApplyMove(activePokemon1, activePokemon2, movePlayer1);
                if (!activePokemon2.IsFainted)
                    ApplyMove(activePokemon2, activePokemon1, movePlayer2);
            }
            else if (activePokemon1.Speed < activePokemon2.Speed)
            {
                ApplyMove(activePokemon2, activePokemon1, movePlayer2);
                if (!activePokemon1.IsFainted)
                    ApplyMove(activePokemon1, activePokemon2, movePlayer1);
            }
            else
            {
                int speedTieBreaker = random.Next(1, 3);
                if (speedTieBreaker == 1)
                {
                    ApplyMove(activePokemon1, activePokemon2, movePlayer1);
                    if (!activePokemon2.IsFainted)
                        ApplyMove(activePokemon2, activePokemon1, movePlayer2);
                }
                else
                {
                    ApplyMove(activePokemon2, activePokemon1, movePlayer2);
                    if (!activePokemon1.IsFainted)
                        ApplyMove(activePokemon1, activePokemon2, movePlayer1);
                }
            }
        }
    }
    public void ApplyMove(pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        int rawDamage = CalculateDamage(attacker, defender, move);
        double boostedAbilityDamage = attacker.Ability.ability.DamageModifier(rawDamage, attacker, defender, move);
        double damageReduction = defender.Ability.ability.DamagaReceivedModifier(rawDamage, attacker, defender, move);

        int finalDamage = Math.Max(0, (int)damageReduction);
        defender.HP = Math.Max(0, defender.HP - finalDamage);

        attacker.Moves.First(m => m.Name == move.Name).PP--;
    }

    public int CalculateDamage(pokemonBattle attacker, pokemonBattle defender, Move move)
    {
        int randomChance = random.Next(0, 101);
        System.Console.WriteLine(move.Name);
        System.Console.WriteLine($"{randomChance} / acurracy {move.Accuracy}");
        if (randomChance < move.Accuracy || move.PP > 0)
        {
            // System.Console.WriteLine("attacker");
            // System.Console.WriteLine(attacker);
            // System.Console.WriteLine("defense");
            // System.Console.WriteLine(defender);
            int effectiveAStat = move.MoveClass == "physical" ? attacker.Attack : attacker.SpecialAttack;
            int effectiveDStat = move.MoveClass == "physical" ? defender.Defense : defender.SpecialDefense;
            double CriticalMultiplier = random.Next(1, 25) == 1 ? 1.5 : 1;
            double randomMultiplier = (double)random.Next(85, 101) / 100;
            double STAB = attacker.Types.Contains(move.Type) ? 1.5 : 1;
            double TypeEffectiveness = 1;
            foreach (var type in defender.Types)
            {
                if (TypeChartDisplay.TypeChart[move.Type].ContainsKey(type))
                    TypeEffectiveness *= TypeChartDisplay.TypeChart[move.Type][type];
            }
            //System.Console.WriteLine($"A = {effectiveAStat} / D = {effectiveDStat} / crit = {CriticalMultiplier} / rand = {randomMultiplier} / STAB = {STAB} / type = {TypeEffectiveness}");
            double outputDamage = ((22 * move.Power * ((double)effectiveAStat / effectiveDStat) / 50) + 2) * CriticalMultiplier * randomMultiplier * STAB * TypeEffectiveness;
            System.Console.WriteLine($"damage = {outputDamage}");
            return (int)outputDamage;
        }

        return 0;
    }

}

public static class TypeChartDisplay
{
    public static Dictionary<string, Dictionary<string, double>> TypeChart = new Dictionary<string, Dictionary<string, double>>() {
    { "normal", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"rock", 0.5},
        {"ghost", 0.0},
        {"steel", 0.5}
    }},

    { "fire", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 0.5},
        {"water", 0.5},
        {"grass", 2.0},
        {"ice", 2.0},
        {"bug", 2.0},
        {"rock", 0.5},
        {"dragon", 0.5},
        {"steel", 2.0}
    }},

    { "water", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 2.0},
        {"water", 0.5},
        {"grass", 0.5},
        {"ground", 2.0},
        {"rock", 2.0},
        {"dragon", 0.5}
    }},

    { "grass", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 0.5},
        {"water", 2.0},
        {"grass", 0.5},
        {"poison", 0.5},
        {"ground", 2.0},
        {"flying", 0.5},
        {"bug", 0.5},
        {"rock", 2.0},
        {"dragon", 0.5},
        {"steel", 0.5},
    }},
    { "electric", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"water", 2.0},
        {"grass", 0.5},
        {"electric", 0.5},
        {"ground", 0},
        {"flying", 2.0},
        {"dragon", 0.5}
    }},


    { "ice", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 0.5},
        {"water", 0.5},
        {"grass", 2.0},
        {"ice", 0.5},
        {"ground", 2.0},
        {"flying", 2.0},
        {"dragon", 2.0},
        {"steel", 0.5},
    }},

    { "fighting", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"normal", 2.0},
        {"ice", 2.0},
        {"poison", 0.5},
        {"flying", 0.5},
        {"psychic", 0.5},
        {"bug", 0.5},
        {"rock", 2.0},
        {"ghost", 0.0},
        {"dark", 2.0},
        {"steel", 2.0},
        {"fairy", 0.5},
    }},

    { "poison", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"grass", 2.0},
        {"poison", 0.5},
        {"ground", 0.5},
        {"rock", 0.5},
        {"ghost", 0.5},
        {"steel", 0.0},
        {"fairy", 2.0},
    }},

    { "ground", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 2.0},
        {"grass", 0.5},
        {"electric", 2.0},
        {"poison", 2.0},
        {"flying", 0.0},
        {"bug", 0.5},
        {"rock", 2.0},
        {"steel", 2.0},
    }},

    { "flying", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"grass", 2.0},
        {"electric", 0.5},
        {"fighting", 2.0},
        {"bug", 2.0},
        {"rock", 0.5},
        {"steel", 0.5}
    }},

    { "psychic", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fighting", 2.0},
        {"poison", 2.0},
        {"psychic", 0.5},
        {"dark", 0.0},
        {"steel", 0.5},
    }},

    { "bug", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 0.5},
        {"grass", 2.0},
        {"fighting", 0.5},
        {"poison", 0.5},
        {"flying", 0.5},
        {"psychic", 2.0},
        {"ghost", 0.5},
        {"dark", 2.0},
        {"steel", 0.5},
        {"fairy", 0.5}
    }},

    { "rock", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 2.0},
        {"ice", 2.0},
        {"fighting", 0.5},
        {"ground", 0.5},
        {"flying", 2.0},
        {"bug", 2.0},
        {"steel", 0.5}
    }},

    { "ghost", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"normal", 0.0},
        {"psychic", 2.0},
        {"ghost", 2.0},
        {"dark", 0.5},
    }},

    { "dragon", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"dragon", 2.0},
        {"steel", 0.5},
        {"fairy", 0.0}
    }},

    { "dark", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fighting", 0.5},
        {"psychic", 2.0},
        {"ghost", 2.0},
        {"dark", 0.5},
        {"fairy", 0.5}
    }},

    { "steel", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 0.5},
        {"water", 0.5},
        {"electric", 0.5},
        {"ice", 2.0},
        {"rock", 2.0},
        {"steel", 0.5},
        {"fairy", 2.0},
    }},

    { "fairy", new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase) {
        {"fire", 0.5},
        {"fighting", 2.0},
        {"poison", 0.5},
        {"dragon", 2.0},
        {"dark", 2.0},
        {"steel", 0.5}
    }}
        };
}
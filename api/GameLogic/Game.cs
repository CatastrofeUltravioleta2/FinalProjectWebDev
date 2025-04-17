using System.Security.Cryptography.X509Certificates;

public class Game
{
    public Guid Id { get; }
    public Player? Player1 { get; set; } = null;
    public Player? Player2 { get; set; } = null;
    public Player currentPlayer { get; set; }
    public Dictionary<string, Dictionary<string, double>> TypeChart { get; set; }
    Random random = new Random();
    public bool isFull => Player1 is not null && Player2 is not null;

    public Game(Guid id)
    {
        Id = id;
        setupTypeChart();

    }

    public void setupTypeChart()
    {
        TypeChart = new Dictionary<string, Dictionary<string, double>>() {
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

        if (actionPlayer1 == "move" && actionPlayer2 != "move")
        {
            if (!activePokemon1.IsFainted)
            {
                Move movePlayer1 = activePokemon1.Moves[indexPlayer1];
                activePokemon2.HP -= CalculateDamage(activePokemon1, activePokemon2, movePlayer1);
            }
        }
        else if (actionPlayer1 != "move" && actionPlayer2 == "move")
        {
            if (!activePokemon2.IsFainted)
            {
                Move movePlayer2 = activePokemon2.Moves[indexPlayer2];
                activePokemon1.HP -= CalculateDamage(activePokemon2, activePokemon1, movePlayer2);
            }
        }
        else if (actionPlayer1 == "move" && actionPlayer2 == "move")
        {
            Move movePlayer1 = activePokemon1.Moves[indexPlayer1];
            Move movePlayer2 = activePokemon2.Moves[indexPlayer2];
            if (activePokemon1.Speed > activePokemon2.Speed)
            {
                activePokemon2.HP -= CalculateDamage(activePokemon1, activePokemon2, movePlayer1);
                if (!activePokemon2.IsFainted)
                    activePokemon1.HP -= CalculateDamage(activePokemon2, activePokemon1, movePlayer2);
            }
            else if (activePokemon1.Speed < activePokemon2.Speed)
            {
                activePokemon1.HP -= CalculateDamage(activePokemon2, activePokemon1, movePlayer2);
                if (!activePokemon1.IsFainted)
                    activePokemon2.HP -= CalculateDamage(activePokemon1, activePokemon2, movePlayer1);
            }
            else
            {
                int speedTieBreaker = random.Next(1, 3);
                if (speedTieBreaker == 1)
                {
                    activePokemon2.HP -= CalculateDamage(activePokemon1, activePokemon2, movePlayer1);
                    if (!activePokemon2.IsFainted)
                        activePokemon1.HP -= CalculateDamage(activePokemon2, activePokemon1, movePlayer2);
                }
                else
                {
                    activePokemon1.HP -= CalculateDamage(activePokemon2, activePokemon1, movePlayer2);
                    if (!activePokemon1.IsFainted)
                        activePokemon2.HP -= CalculateDamage(activePokemon1, activePokemon2, movePlayer1);
                }
            }
            if(activePokemon1.HP < 0) activePokemon1.HP = 0;
            if(activePokemon2.HP < 0) activePokemon2.HP = 0;
        }

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
                if (TypeChart[move.Type].ContainsKey(type))
                    TypeEffectiveness *= TypeChart[move.Type][type];
            }
            //System.Console.WriteLine($"A = {effectiveAStat} / D = {effectiveDStat} / crit = {CriticalMultiplier} / rand = {randomMultiplier} / STAB = {STAB} / type = {TypeEffectiveness}");
            double outputDamage = ((22 * move.Power * ( (double) effectiveAStat / effectiveDStat) / 50) + 2) * CriticalMultiplier * randomMultiplier * STAB * TypeEffectiveness;
            System.Console.WriteLine($"damage = {outputDamage}");
            attacker.Moves.First(m => m.Name == move.Name).PP -= 1;
            return (int)outputDamage;
        }

        return 0;
    }

}
public class pokemonTeamBattle
{
    public List<pokemonBattle> Pokemons { get; set; } = new List<pokemonBattle>();
    public int ActivePokemonIndex { get; set; }
    public pokemonBattle ActivePokemmon() => Pokemons[ActivePokemonIndex];
    public bool AllFainted() => Pokemons.All(p => p.HP == 0);

    public void SwticActivePokemon(int newIndex)
    {
        ActivePokemonIndex = newIndex;
    }
    public pokemonTeamBattle(List<pokemonBattle> pokemons)
    {
        Pokemons = pokemons;
        ActivePokemonIndex = 0;
    }

}
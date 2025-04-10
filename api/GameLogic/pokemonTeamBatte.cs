public class pokemonTeamBattle
{
   public List<pokemonBattle> Pokemons {get; set;} = new List<pokemonBattle>();
   public int ActivePokemonIndex {get;set;} = 0;
   public pokemonBattle ActivePokemmon () => Pokemons[ActivePokemonIndex];

   public void SwticActivePokemon (int newIndex)
   {
    // switch active pokemon
   }
}
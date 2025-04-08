using System.Text.Json;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

string userInfoFile = "userInfo.json";
string teamsFile = "teamsInfo.json";

List<userAccount> users = new();
List<pokemonTeam> allTeams = new();

if (File.Exists(userInfoFile))
{
    var json = File.ReadAllText(userInfoFile);
    users.AddRange(JsonSerializer.Deserialize<List<userAccount>>(json));
}
if (File.Exists(teamsFile))
{
    var json = File.ReadAllText(teamsFile);
    allTeams.AddRange(JsonSerializer.Deserialize<List<pokemonTeam>>(json));
}

app.MapGet("/", () => "Hello World!");
app.MapGet("/Accounts", () => users);
app.MapPost("/Accounts", (userAccount user) =>
{
    users.Add(user);
    var json = JsonSerializer.Serialize(users);
    File.WriteAllText(userInfoFile, json);
});

app.MapGet("/Teams", () => allTeams);
app.MapGet("/Teams/{id}", (long id) => allTeams.Find(team => team.teamId == id));

app.MapPost("/Teams", (pokemonTeam team) =>
{
    var index = allTeams.FindIndex(t => t.teamId == team.teamId);
    if ( index == -1)
    {
        allTeams.Add(team);
    }
    else
    {
        allTeams[index] = new pokemonTeam(team.Pokemons, team.teamId, team.owner);
    }
    var json = JsonSerializer.Serialize(allTeams);
    File.WriteAllText(teamsFile, json);
});


app.Run();


public record userAccount(string username, string email, int age, string region);
public record pokemonTeam(pokemon[] Pokemons, long teamId, string owner);
public record pokemon(int id, string ability, string abilityURL, string[] moves, string[] movesURL);
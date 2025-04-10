using System.Text.Json;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Http;
using System.Net;
using GameLogic;
using System.Runtime.CompilerServices;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

//enable websocket
// store list of connections/ users as key and connections as values
Queue<WebSocket> playersWaitingToPair = new Queue<WebSocket>();
app.UseWebSockets(new WebSocketOptions() { KeepAliveInterval = TimeSpan.FromMinutes(2) });
app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
        System.Console.WriteLine("connection accepted");
        await SendMessage(webSocket);
    }
    else
    {
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
    }
});

static async Task SendMessage(WebSocket webSocket)
{
    var bytes = Encoding.UTF8.GetBytes("send message");
    await webSocket.SendAsync(
        new ArraySegment<byte>(bytes),
        WebSocketMessageType.Text,
        true,
        CancellationToken.None
    );
}

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
    if (index == -1)
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
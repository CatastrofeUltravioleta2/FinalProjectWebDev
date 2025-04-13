using System.Text.Json;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Http;
using System.Net;
using GameLogic;
using System.Runtime.CompilerServices;
using System.Text;
using Records;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

//enable websocket
// store list of connections/ users as key and connections as values
Queue<string> playersWaitingToPair = new Queue<string>();
Dictionary<string, WebSocket> connections = new Dictionary<string, WebSocket>();
Dictionary<string, List<pokemonBattle>> Players = new Dictionary<string, List<pokemonBattle>>();

app.UseWebSockets(new WebSocketOptions() { KeepAliveInterval = TimeSpan.FromMinutes(2) });

app.Map("/battle", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await HandleWebSocket(webSocket);
    }
    else
    {
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
    }
});

async Task HandleWebSocket(WebSocket webSocket)
{
    var buffer = new byte[1024 * 4];
    var receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    var message = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
    userIndetification? currentUser = await waitForUser(message);

    if (currentUser is null || connections.ContainsKey(currentUser.userData))
    {
        //await SendMessage(webSocket, "User invalid or already connected");
        System.Console.WriteLine("user invalid already connected");
        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "User invalid or already connected", CancellationToken.None);
        return;
    }
    connections[currentUser.userData] = webSocket;
    Players[currentUser.userData] = currentUser.team;
    string oponent = null;
    Guid currentGameId = default;


    if (playersWaitingToPair.Count == 0)
    {
        playersWaitingToPair.Enqueue(currentUser.userData);
        string sendJSON = """
            {"type": "userStatus",
            "message": "Waiting for other player to connect"}
            """;
        await SendMessage(webSocket, sendJSON);
    }
    else
    {
        oponent = playersWaitingToPair.Dequeue(); //find oponent
        currentGameId = Lobby.JoinGame(
            new Player(currentUser.userData, new pokemonTeamBattle(Players[currentUser.userData])),
            new Player(oponent, new pokemonTeamBattle(Players[oponent]))
            );

        string sendJSON = $"{{\"type\": \"joinGame\", \"message\": \"Match Found\", \"gameId\": \"{currentGameId}\"}}";

        await SendMessage(connections[currentUser.userData], sendJSON);
        await SendMessage(connections[oponent], sendJSON);

    }

    while (!receiveResult.CloseStatus.HasValue)
    {
        if(currentGameId != default)
        {
            var currentGame = Lobby.GetGameById(currentGameId);
            string updatedTeams = $"{{\"type\": \"teamUpdate\", \"player1\": {JsonSerializer.Serialize(currentGame.Player1)}, \"player2\": {JsonSerializer.Serialize(currentGame.Player2)}}}";
            System.Console.WriteLine(currentGame.Player1.Info);
            System.Console.WriteLine(currentGame.Player2.Info);
            System.Console.WriteLine(currentGame.Player1.Team.ActivePokemonIndex);
            System.Console.WriteLine(currentGame.Player2.Team.ActivePokemonIndex);
            foreach(var p in currentGame.Player1.Team.Pokemons)
                System.Console.WriteLine(p);
            System.Console.WriteLine();
            foreach(var p in currentGame.Player1.Team.Pokemons)
                System.Console.WriteLine(p);
            await SendMessage(connections[currentGame.Player1.Info], updatedTeams);
            await SendMessage(connections[currentGame.Player2.Info], updatedTeams);
        }

        receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        //battle message
    }

}
static async Task SendMessage(WebSocket webSocket, string message)
{
    var bytes = Encoding.UTF8.GetBytes(message);
    await webSocket.SendAsync(
        new ArraySegment<byte>(bytes),
        WebSocketMessageType.Text,
        true,
        CancellationToken.None
    );
}
static async Task<userIndetification> waitForUser(string message)
{
    var data = JsonSerializer.Deserialize<userIndetification>(message);
    // try
    // {
    if (data is not null && data.type == "userIndetification")
    {
        return data;
    }
    throw new Exception();
    // }
    // catch
    // { }
    // return null;
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


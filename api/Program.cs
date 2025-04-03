using System.Text.Json;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

string userInfoFile = "userInfo.json";
List<userAccount> users = new();
if(File.Exists(userInfoFile))
{
    var json = File.ReadAllText(userInfoFile);
    users.AddRange(JsonSerializer.Deserialize<List<userAccount>>(json));
}
app.MapGet("/", () => "Hello World!");
app.MapGet("/Accounts", () => users);
app.MapPost("/Accounts", (userAccount user) => 
{
    users.Add(user);
    var json = JsonSerializer.Serialize(users);
    File.WriteAllText(userInfoFile, json);
});

app.Run();


public record userAccount(string username, string email, int age, string region);
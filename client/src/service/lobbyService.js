import { getTeamForBattle } from "../domain/lobbyDomain.js";
var socket = undefined;
export const SetupConnection = (onMessageReceived) => {

  socket = new WebSocket("ws://localhost:5176/battle");
  if (!socket) return;

  const user = sessionStorage.getItem("username");
  const email = sessionStorage.getItem("email");

  socket.addEventListener("open", () => {
    console.log("WebSocket connected");

    const teamToSend = getTeamForBattle();
    const identification = {
      type: "userIndetification",
      userData: `${user}|${email}`,
      team: teamToSend.pokemons,
    };
    console.log(`${user}|${email}`);
    socket.send(JSON.stringify(identification));
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    console.log("Received message:", data);
    onMessageReceived(data);
    console.log(socket)
  });

  socket.addEventListener("close", (event) => {
    console.log("websocket disconnected")
    console.log(event)
  })

  socket.addEventListener("error" , (event) => {
    console.log(`got error`, event)
  })
};

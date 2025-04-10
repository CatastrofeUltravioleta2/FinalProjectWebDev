import { getTeamForBattle } from "../domain/lobbyDomain.js";

const socket = new WebSocket("ws://localhost:5176/battle");

const user = sessionStorage.getItem("username");
const email = sessionStorage.getItem("email");

socket.addEventListener("open", () => {
    console.log("WebSocket connected");

    const identification = {
      type: "userIndetification",
      userData: `${user}|${email}`,
      team: getTeamForBattle(),
    };

    socket.send(JSON.stringify(identification));
  });

  socket.addEventListener("message", event => {

    console.log(event)
    const data = JSON.parse(event.data);
    console.log(data);

    console.log("Received message:", data);

    if (data.type === "userStatus") {
      // waiting for other player
    } else if (data.type === "joinGame") {
      // join game with id
    }
  });

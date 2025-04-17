import { getTeamForBattle } from "../domain/combatDomain.js";
var socket = undefined;
// var handleMessageFunctions = [];
const SetupConnection = () => {
  socket = new WebSocket("ws://localhost:5176/battle");
  console.log(socket)

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

  // socket.addEventListener("message", (event) => {
  //   const data = JSON.parse(event.data);
  //   console.log("Received message:", data);
  //   handleMessageFunctions.forEach( async (func) => await func(data));
  // });

  socket.addEventListener("close", (event) => {
    console.log("websocket disconnected");
    console.log(event);
  });

  socket.addEventListener("error", (event) => {
    console.log(`got error`, event);
  });
};

export const getWebSocket = () => {
  return socket;
};

export const initializeWebSocket = () => {
  SetupConnection();
};

export const SendAction = (actionType, data) => {
  const action = {
    actionType: actionType,
    index: data,
  }

  console.log(socket);
  console.log(JSON.stringify(action))

  socket.send(JSON.stringify(action));
}

// export const addMessageHandler = (func) => {
//   handleMessageFunctions.push(func);
// };

// if (sessionStorage.getItem("username") == null) {
//   window.location.replace("login.html");
// }


const socket = new WebSocket("ws://localhost:5176/ws");

socket.addEventListener("open", (e) => {
  console.log("connected openned")
})

socket.addEventListener("message", (e) => {
  console.log("listenig")
  console.log(e.data)
})
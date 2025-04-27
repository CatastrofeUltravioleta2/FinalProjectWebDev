import {
  getCurrentUserInfo,
  getUserMatches,
  getUserMatchesAndInfo,
} from "../domain/accountDomain.js";

async function renderAccountPage() {
  const userData = getCurrentUserInfo();
  const matches = getUserMatches();

  console.log(matches)

  document.getElementById("infoUsername").textContent = userData.username;
  document.getElementById("infoEmail").textContent = userData.email;
  document.getElementById("infoAge").textContent = userData.age;
  document.getElementById("infoRegion").textContent = userData.region;

  const list = document.getElementById("matchesList");
  if (!matches || matches.length === 0) {
    list.textContent = "You have no recorded matches yet.";
  } else {
    matches.forEach((match) => {
      const p1 = match.player1.info.split("|")[0];
      const p2 = match.player2.info.split("|")[0];
      const winner = match.winner.split("|")[0];

      const item = document.createElement("div");
      item.className = "matchItem";
      item.textContent = `${p1} vs ${p2} — Winner: ${winner}`;
      list.appendChild(item);
    });
  }
}

await getUserMatchesAndInfo();
await renderAccountPage();

if (sessionStorage.getItem("username") == null) {
  window.location.replace("login.html");
}

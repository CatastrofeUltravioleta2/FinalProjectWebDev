const getWinnerFromQueryString = () => {
  const queryString = window.location.search;
  setupGameOver(queryString.split("|")[0].slice(1));
};

const setupGameOver = (winner) => {
  const winnerTitle = document.getElementById("winnerTitle");
  winnerTitle.textContent = `Winner: ${winner}`;
};

getWinnerFromQueryString();

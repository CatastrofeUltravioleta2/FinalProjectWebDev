import { getMatchInfo } from "../service/combatSerivce.js";
import { getUsersFromApi } from "../service/loginService.js";

var users = [];
var currentUserInfo = {};
var matchesFromUser = [];

export const getUserMatchesAndInfo = async () => {
  users = await getUsersFromApi();
  const user = sessionStorage.getItem("username");
  const email = sessionStorage.getItem("email");
  const userData = `${user}|${email}`;

  console.log(users);

  currentUserInfo = users.find(
    (u) => u.email == email && u.username == user
  );
  console.log("user info", user, email)
  console.log(currentUserInfo);

  var matches = await getMatchInfo(userData);
  matchesFromUser = Array.isArray(matches) ? matches : [];

  console.log(matchesFromUser);
};

export const getCurrentUserInfo = () => {
  return { ...currentUserInfo };
};

export const getUserMatches = () => {
  return [...matchesFromUser];
};

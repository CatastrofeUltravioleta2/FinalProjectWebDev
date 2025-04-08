import { getUsersFromApi } from "../service/loginService.js";

var usersAccounts = [];

// sessionStorage.setItem("username", "thiosnafoe")
// var username = sessionStorage.getItem("username") //authoritative
// var currentUserData //not

// var userTeams //comes from api
export const setSessionCurrentUser = (username, email) => {
  sessionStorage.setItem("username", username);
  sessionStorage.setItem("email", email)
};

const populateUsers = async () => {
  const allUsers = await getUsersFromApi();
  const usersPromises = allUsers.map(async (u) => {
    return await u;
  });
  usersAccounts = await Promise.all(usersPromises);
  console.log(usersAccounts);
};

export const isUserAlreadyRegistered = (email, username) => {
  return usersAccounts
    .map((u) => (u.email, u.username))
    .includes((email, username));
};

await populateUsers();

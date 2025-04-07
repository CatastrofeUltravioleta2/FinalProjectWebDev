import { getUsersFromApi } from "../service/loginService.js";

var usersAccounts = [];

const populateUsers = async () => {
  const allUsers = await getUsersFromApi();
  const usersPromises = allUsers.map(async (u) => {
    return await u;
  });
  usersAccounts = await Promise.all(usersPromises);
};

export const isUserAlreadyRegistered = (email, username) => {
  return usersAccounts.map((u) => u.email).includes(email) && usersAccounts.map((u) => u.username).includes(username);
};

await populateUsers();

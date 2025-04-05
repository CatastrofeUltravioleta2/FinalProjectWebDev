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
  console.log(usersAccounts)
  console.log(usersAccounts.map((u) => u.email));
  console.log(email)
  console.log(usersAccounts.map((u) => u.email).includes(email))
  console.log(usersAccounts.map((u) => u.username).includes(username))
  console.log({email, username})
  return usersAccounts.map((u) => u.email).includes(email) && usersAccounts.map((u) => u.username).includes(username);
};

await populateUsers();

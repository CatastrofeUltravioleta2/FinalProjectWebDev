const apiAdress = "http://localhost:5176";

export const sendUserInfoToApi = async (username, email, age, region) => {
  const userInfo = {
    username,
    email,
    age,
    region,
  };

  await fetch(`${apiAdress}/Accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  });
};

export const getUsersFromApi = async () => {
  const response = await fetch(`${apiAdress}/Accounts`, {
    method: "GET",
  });
  return await response.json();
};


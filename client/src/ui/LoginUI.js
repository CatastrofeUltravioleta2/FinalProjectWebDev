import {
  isUserAlreadyRegistered,
  setSessionCurrentUser,
} from "../domain/loginDomain.js";
import { sendUserInfoToApi } from "../service/loginService.js";

const SwitchCreateAccountOrLogIn = () => {
  const SwitchToCreateAccountButton = document.getElementById(
    "SwitchToCreateAccount"
  );
  const SwitchToLogInButton = document.getElementById("SwitchToLogIn");

  const CreateAccountForm = document.getElementById("createAccount-form");
  const LogInForm = document.getElementById("login-form");

  SwitchToCreateAccountButton.addEventListener("click", (e) => {
    CreateAccountForm.style.display = "flex";
    LogInForm.style.display = "none";
  });

  SwitchToLogInButton.addEventListener("click", (e) => {
    CreateAccountForm.style.display = "none";
    LogInForm.style.display = "flex";
  });
};

const AddValidationToLogIn = () => {
  const logInForm = document.getElementById("login-form");
  const usernameLogin = document.getElementById("usernameLogin");
  const usernameError = document.getElementById("usernameLoginError");

  const emailLogin = document.getElementById("emailLogin");
  const emailError = document.getElementById("emailLoginError");
  const userDoesNotExistError = document.getElementById("userDoesNotExist");

  usernameLogin.addEventListener("input", (e) => {
    if (e.target.value === "") {
      usernameError.style.display = "block";
      usernameError.textContent = "Must enter a username";
    } else {
      usernameError.style.display = "none";
      usernameError.textContent = "";
    }
  });

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  emailLogin.addEventListener("input", (e) => {
    if (e.target.value === "") {
      emailError.style.display = "block";
      emailError.textContent = "Must enter an email";
    } else if (!emailRegex.test(e.target.value)) {
      emailError.style.display = "block";
      emailError.textContent = "Invalid Email syntax";
    } else {
      emailError.style.display = "none";
      emailError.textContent = "";
    }
  });

  logInForm.addEventListener("submit", (e) => {
    var isUserValid = true;
    if (usernameLogin.value === "") {
      e.preventDefault();
      usernameError.style.display = "block";
      usernameError.textContent = "Must enter a username";
      isUserValid = false;
    }
    if (usernameError.textContent !== "") {
      e.preventDefault();
      isUserValid = false;
    }
    if (emailLogin.value === "") {
      e.preventDefault();
      emailError.style.display = "block";
      emailError.textContent = "Must enter an email";
      isUserValid = false;
    }
    if (emailError.textContent !== "") {
      e.preventDefault();
      isUserValid = false;
    }

    if (userDoesNotExistError.textContent !== "") {
      e.preventDefault();
      isUserValid = false;
    }

    if (
      usernameLogin.value !== "" &&
      emailLogin.value !== "" &&
      !isUserAlreadyRegistered(emailLogin.value, usernameLogin.value)
    ) {
      e.preventDefault();
      userDoesNotExistError.style.display = "block";
      userDoesNotExistError.textContent = "User is not registered";
      setTimeout(() => {
        userDoesNotExistError.style.display = "none";
        userDoesNotExistError.textContent = "";
      }, 5000);
      isUserValid = false;
    }

    if (isUserValid) {
      setSessionCurrentUser(usernameLogin.value, emailLogin.value);
    }
  });
};

const AddValidationToCreateAccount = () => {
  const CreateAccountForm = document.getElementById("createAccount-form");
  const username = document.getElementById("username");
  const usernameError = document.getElementById("usernameError");

  const email = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const userAlreadyExistError = document.getElementById("userAlreadyExists");

  const age = document.getElementById("age");
  const ageError = document.getElementById("ageError");

  const region = document.getElementById("region");
  const regionError = document.getElementById("regionError");

  username.addEventListener("input", (e) => {
    if (e.target.value === "") {
      usernameError.style.display = "block";
      usernameError.textContent = "Must enter a username";
    } else {
      usernameError.style.display = "none";
      usernameError.textContent = "";
    }
  });

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  email.addEventListener("input", (e) => {
    if (e.target.value === "") {
      emailError.style.display = "block";
      emailError.textContent = "Must enter an email";
    } else if (!emailRegex.test(e.target.value)) {
      emailError.style.display = "block";
      emailError.textContent = "Invalid Email syntax";
    } else {
      emailError.style.display = "none";
      emailError.textContent = "";
    }
  });

  age.addEventListener("input", (e) => {
    if (e.target.value === "") {
      ageError.style.display = "block";
      ageError.textContent = "Must enter an age";
    } else if (e.target.value < 0 || e.target.value > 90) {
      ageError.style.display = "block";
      ageError.textContent = "Invalid age";
    } else {
      ageError.style.display = "none";
      ageError.textContent = "";
    }
  });

  region.addEventListener("change", (e) => {
    if (e.target.value === "") {
      regionError.style.display = "block";
      regionError.textContent = "Must select a region";
    } else {
      regionError.style.display = "none";
      regionError.textContent = "";
    }
  });

  CreateAccountForm.addEventListener("submit", async (e) => {
    if (username.value === "") {
      e.preventDefault();
      usernameError.style.display = "block";
      usernameError.textContent = "Must enter a username";
    }
    if (usernameError.textContent !== "") {
      e.preventDefault();
    }
    if (email.value === "") {
      e.preventDefault();
      emailError.style.display = "block";
      emailError.textContent = "Must enter an email";
    }
    if (emailError.textContent !== "") {
      e.preventDefault();
    }

    if (age.value == "") {
      e.preventDefault();
      ageError.style.display = "block";
      ageError.textContent = "Must enter an age";
    }
    if (ageError.textContent !== "") {
      e.preventDefault();
    }

    if (region.value == "") {
      e.preventDefault();
      regionError.style.display = "block";
      regionError.textContent = "Must select a region";
    }
    if (regionError.textContent !== "") {
      e.preventDefault();
    }

    if (
      username.value !== "" &&
      email.value !== "" &&
      isUserAlreadyRegistered(email.value, username.value)
    ) {
      console.log("user not registered");
      userAlreadyExistError.style.display = "block";
      userAlreadyExistError.textContent = "User is already registered";
      setTimeout(() => {
        userAlreadyExistError.style.display = "none";
        userAlreadyExistError.textContent = "";
      }, 5000);
      e.preventDefault();
    }

    const isUserValid =
      username.value !== "" &&
      usernameError.textContent === "" &&
      email.value !== "" &&
      emailError.textContent === "" &&
      age.value != "" &&
      ageError.textContent === "" &&
      region.value != "" &&
      regionError.textContent === "" &&
      !isUserAlreadyRegistered(email.value, username.value);

    if (isUserValid) {
      setSessionCurrentUser(username.value, email.value);
      await sendUserInfoToApi(
        username.value,
        email.value,
        age.value,
        region.value
      );
    }
  });
};

AddValidationToLogIn();
AddValidationToCreateAccount();
SwitchCreateAccountOrLogIn();

const authCard = document.getElementById("authCard");
const registerCard = document.getElementById("registerCard");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const logoutBtn = document.getElementById("logoutBtn");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");
const welcomeMessage = document.getElementById("welcomeMessage");

function getUser() {
  return JSON.parse(localStorage.getItem("registeredUser"));
}

function showMessage(element, message) {
  element.textContent = message;
}

showRegister.addEventListener("click", () => {
  authCard.classList.add("hidden");
  registerCard.classList.remove("hidden");

  loginMessage.textContent = "";
});

showLogin.addEventListener("click", () => {
  registerCard.classList.add("hidden");
  authCard.classList.remove("hidden");

  registerMessage.textContent = "";
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password.length < 6) {
    showMessage(
      registerMessage,
      "Password must contain at least 6 characters.",
    );
    return;
  }

  if (password !== confirmPassword) {
    showMessage(registerMessage, "Passwords do not match.");
    return;
  }

  const user = {
    name: name,
    email: email,
    password: password,
  };

  localStorage.setItem("registeredUser", JSON.stringify(user));

  showMessage(
    registerMessage,
    "Account created successfully. You can now login.",
  );

  registerForm.reset();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const user = getUser();

  if (!user) {
    showMessage(
      loginMessage,
      "No account found. Please create an account first.",
    );
    return;
  }

  if (email !== user.email || password !== user.password) {
    showMessage(loginMessage, "Incorrect email or password.");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");

  showDashboard(user);
});

function showDashboard(user) {
  authCard.classList.add("hidden");
  registerCard.classList.add("hidden");
  dashboard.classList.remove("hidden");

  welcomeMessage.textContent = `Welcome, ${user.name}!`;
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");

  dashboard.classList.add("hidden");
  authCard.classList.remove("hidden");

  loginForm.reset();
  loginMessage.textContent = "";
});

function checkLogin() {
  const user = getUser();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (user && isLoggedIn === "true") {
    showDashboard(user);
  }
}

checkLogin();

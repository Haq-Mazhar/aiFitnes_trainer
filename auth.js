function validateRequired(value) {
  return value !== null && value !== undefined && value.toString().trim() !== "";
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 6;
}

function validateNumber(value, min, max) {
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}

function validateAge(age) {
  return validateNumber(age, 10, 100);
}

function validateHeight(height) {
  return validateNumber(height, 80, 250); 
}

function validateWeight(weight) {
  return validateNumber(weight, 20, 300); 
}

function setFieldError(inputEl, errorEl, message) {
  if (message) {
    inputEl.classList.add("is-invalid");
    errorEl.textContent = message;
  } else {
    inputEl.classList.remove("is-invalid");
    errorEl.textContent = "";
  }
}

function getAllUsers() {
  return getData("users", []);
}

function saveAllUsers(users) {
  saveData("users", users);
}

function findUserByEmail(email) {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function handleSignup(event) {
  event.preventDefault();

  const nameInput = document.getElementById("signupName");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("signupConfirmPassword");

  let isValid = true;

  if (!validateRequired(nameInput.value)) {
    setFieldError(nameInput, document.getElementById("signupNameError"), "Full name is required.");
    isValid = false;
  } else {
    setFieldError(nameInput, document.getElementById("signupNameError"), "");
  }

  if (!validateEmail(emailInput.value)) {
    setFieldError(emailInput, document.getElementById("signupEmailError"), "Enter a valid email address.");
    isValid = false;
  } else if (findUserByEmail(emailInput.value)) {
    setFieldError(emailInput, document.getElementById("signupEmailError"), "An account with this email already exists.");
    isValid = false;
  } else {
    setFieldError(emailInput, document.getElementById("signupEmailError"), "");
  }

  if (!validatePassword(passwordInput.value)) {
    setFieldError(passwordInput, document.getElementById("signupPasswordError"), "Password must be at least 6 characters.");
    isValid = false;
  } else {
    setFieldError(passwordInput, document.getElementById("signupPasswordError"), "");
  }

  if (confirmInput.value !== passwordInput.value || confirmInput.value === "") {
    setFieldError(confirmInput, document.getElementById("signupConfirmError"), "Passwords do not match.");
    isValid = false;
  } else {
    setFieldError(confirmInput, document.getElementById("signupConfirmError"), "");
  }

  if (!isValid) return;

  const newUser = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value, 
  };

  const users = getAllUsers();
  users.push(newUser);
  saveAllUsers(users);

  saveData("currentUser", newUser.email);
  saveData("profileComplete", false);

  showToast("Account created successfully. Let's set up your profile.", "success");
  document.getElementById("signupForm").reset();
  goToScreen("screen-profile-setup");
}

function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const errorBox = document.getElementById("loginError");

  errorBox.classList.add("d-none");

  const user = findUserByEmail(emailInput.value);

  if (!user || user.password !== passwordInput.value) {
    errorBox.textContent = "Invalid email or password.";
    errorBox.classList.remove("d-none");
    return;
  }

  saveData("currentUser", user.email);
  document.getElementById("loginForm").reset();

  const profileComplete = getData("profileComplete", false);

  if (profileComplete) {
    showToast(`Welcome back, ${user.name}!`, "success");
    goToScreen("screen-dashboard");
    refreshDashboard();
  } else {
    goToScreen("screen-profile-setup");
  }
}

function handleLogout() {
  removeData("currentUser");
  showToast("You have been logged out.", "success");
  goToScreen("screen-welcome");
}

function getCurrentUser() {
  const email = getData("currentUser", null);
  if (!email) return null;
  return findUserByEmail(email);
}
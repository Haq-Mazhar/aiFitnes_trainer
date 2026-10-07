const allScreenIds = [
  "screen-splash",
  "screen-welcome",
  "screen-login",
  "screen-signup",
  "screen-profile-setup",
  "screen-goal",
  "screen-bmi",
  "screen-calories",
  "screen-workout-plan",
  "screen-diet-plan",
  "screen-dashboard",
  "screen-workout",
  "screen-diet",
  "screen-progress",
  "screen-chatbot",
  "screen-profile-page",
  "screen-edit-profile",
  "screen-change-goal",
];
function goToScreen(screenId) {
  allScreenIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("d-none", id !== screenId);
  });

  const showNav = ["screen-dashboard", "screen-workout", "screen-diet", "screen-progress", "screen-chatbot", "screen-profile-page"].includes(
    screenId
  );
  document.getElementById("mainNavbar").classList.toggle("d-none", !showNav);

  document.querySelectorAll("#mainNavbar .nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.screen === screenId);
  });

  window.scrollTo(0, 0);
}

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-white bg-${type === "success" ? "success" : "danger"} border-0`;
  toastEl.setAttribute("role", "alert");
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;

  toastContainer.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

function navigateTo(screenId) {
  if (screenId === "screen-dashboard") refreshDashboard();
  if (screenId === "screen-workout") renderWorkoutSection();
  if (screenId === "screen-diet") renderDietSection();
  if (screenId === "screen-progress") renderProgressDashboard();
  if (screenId === "screen-chatbot") initChatbot();
  if (screenId === "screen-profile-page") renderProfilePage();

  goToScreen(screenId);
}

function renderWorkoutSection() {
  renderWorkoutPlan();
  renderWorkoutTracker();
}

function renderDietSection() {
  renderDietPlan();
}

function initApp() {

  document.getElementById("signupForm").addEventListener("submit", handleSignup);
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("profileSetupForm").addEventListener("submit", handleProfileSetup);
  document.getElementById("editProfileForm").addEventListener("submit", handleEditProfile);

  setTimeout(() => {
    routeOnStartup();
  }, 2000);
}

function routeOnStartup() {
  const currentUserEmail = getData("currentUser", null);
  const profileComplete = getData("profileComplete", false);

  if (!currentUserEmail) {
    goToScreen("screen-welcome");
    return;
  }

  const profile = getData("profile", null);
  const goal = getData("goal", null);

  if (profile && goal) {
    navigateTo("screen-dashboard");
  } else if (profile) {
    runBmiCalculation();
    goToScreen("screen-goal");
  } else {
    goToScreen("screen-profile-setup");
  }
}

document.addEventListener("DOMContentLoaded", initApp);
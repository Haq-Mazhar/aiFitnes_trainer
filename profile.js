function handleProfileSetup(event) { 
  event.preventDefault();

  const ageInput = document.getElementById("profileAge");
  const genderInput = document.querySelector('input[name="profileGender"]:checked');
  const heightInput = document.getElementById("profileHeight");
  const weightInput = document.getElementById("profileWeight");
  const activityInput = document.getElementById("profileActivity");

  let isValid = true;

  if (!validateAge(ageInput.value)) {
    setFieldError(ageInput, document.getElementById("profileAgeError"), "Enter an age between 10 and 100.");
    isValid = false;
  } else {
    setFieldError(ageInput, document.getElementById("profileAgeError"), "");
  }

  if (!genderInput) {
    document.getElementById("profileGenderError").textContent = "Please select a gender.";
    isValid = false;
  } else {
    document.getElementById("profileGenderError").textContent = "";
  }

  if (!validateHeight(heightInput.value)) {
    setFieldError(heightInput, document.getElementById("profileHeightError"), "Enter a height between 80 and 250 cm.");
    isValid = false;
  } else {
    setFieldError(heightInput, document.getElementById("profileHeightError"), "");
  }

  if (!validateWeight(weightInput.value)) {
    setFieldError(weightInput, document.getElementById("profileWeightError"), "Enter a weight between 20 and 300 kg.");
    isValid = false;
  } else {
    setFieldError(weightInput, document.getElementById("profileWeightError"), "");
  }

  if (!isValid) return;

  const profile = {
    age: Number(ageInput.value),
    gender: genderInput.value,
    height: Number(heightInput.value),
    weight: Number(weightInput.value),
    activityLevel: activityInput.value,
    startingWeight: Number(weightInput.value),
  };

  const existing = getData("profile", null);
  if (existing && existing.startingWeight) {
    profile.startingWeight = existing.startingWeight;
  }

  saveData("profile", profile);
  showToast("Profile saved successfully.", "success");
  goToScreen("screen-goal");
}

const GOAL_LABELS = {
  lose: "Lose Weight",
  gain: "Gain Muscle",
  healthy: "Stay Healthy",
  improve: "Improve Fitness",
};

function selectGoal(goalKey) {
  document.querySelectorAll(".goal-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.goal === goalKey);
  });
  saveData("selectedGoalKey", goalKey);
  document.getElementById("goalContinueBtn").disabled = false;
}

function confirmGoal() {
  const goalKey = getData("selectedGoalKey", null);
  if (!goalKey) return;

  saveData("goal", GOAL_LABELS[goalKey]);
  saveData("goalKey", goalKey);

  runBmiCalculation();
  goToScreen("screen-bmi");
}

function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

function getBmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function runBmiCalculation() {
  const profile = getData("profile");
  if (!profile) return;

  const bmi = calculateBMI(profile.weight, profile.height);
  const category = getBmiCategory(bmi);

  saveData("bmi", bmi);
  saveData("bmiCategory", category);

  document.getElementById("bmiValue").textContent = bmi;
  document.getElementById("bmiCategory").textContent = category;

  const badge = document.getElementById("bmiCategory");
  badge.className = "badge fs-6 mt-2 align-self-center bmi-badge-" + category.toLowerCase();
}

function continueToCalories() {
  runCalorieCalculation();
  goToScreen("screen-calories");
}

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const ACTIVITY_LABELS = {
  sedentary: "Sedentary",
  light: "Lightly Active",
  moderate: "Moderately Active",
  active: "Very Active",
};

function calculateBMR(profile) {
  const { weight, height, age, gender } = profile;
  if (gender === "Male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

function runCalorieCalculation() {
  const profile = getData("profile");
  const goalKey = getData("goalKey");
  if (!profile) return;

  const bmr = calculateBMR(profile);
  const factor = ACTIVITY_FACTORS[profile.activityLevel] || 1.2;
  let calories = bmr * factor;

  if (goalKey === "lose") calories -= 400;
  if (goalKey === "gain") calories += 250;

  calories = Math.round(calories);

  saveData("calories", calories);

  document.getElementById("caloriesValue").textContent = calories;
  document.getElementById("caloriesActivity").textContent = ACTIVITY_LABELS[profile.activityLevel] || "";
  document.getElementById("caloriesGoal").textContent = getData("goal", "");
}

function continueToWorkoutPlan() {
  renderWorkoutPlan();
  goToScreen("screen-workout-plan");
}

function openEditProfile() {
  const profile = getData("profile");
  if (!profile) return;

  document.getElementById("editAge").value = profile.age;
  document.getElementById("editHeight").value = profile.height;
  document.getElementById("editWeight").value = profile.weight;
  document.getElementById("editActivity").value = profile.activityLevel;
  document
    .querySelectorAll('input[name="editGender"]')
    .forEach((input) => (input.checked = input.value === profile.gender));

  goToScreen("screen-edit-profile");
}

function handleEditProfile(event) {
  event.preventDefault();

  const ageInput = document.getElementById("editAge");
  const genderInput = document.querySelector('input[name="editGender"]:checked');
  const heightInput = document.getElementById("editHeight");
  const weightInput = document.getElementById("editWeight");
  const activityInput = document.getElementById("editActivity");

  let isValid = true;
  if (!validateAge(ageInput.value)) {
    setFieldError(ageInput, document.getElementById("editAgeError"), "Enter an age between 10 and 100.");
    isValid = false;
  } else {
    setFieldError(ageInput, document.getElementById("editAgeError"), "");
  }
  if (!validateHeight(heightInput.value)) {
    setFieldError(heightInput, document.getElementById("editHeightError"), "Enter a height between 80 and 250 cm.");
    isValid = false;
  } else {
    setFieldError(heightInput, document.getElementById("editHeightError"), "");
  }
  if (!validateWeight(weightInput.value)) {
    setFieldError(weightInput, document.getElementById("editWeightError"), "Enter a weight between 20 and 300 kg.");
    isValid = false;
  } else {
    setFieldError(weightInput, document.getElementById("editWeightError"), "");
  }
  if (!isValid) return;

  const profile = getData("profile");
  profile.age = Number(ageInput.value);
  profile.gender = genderInput.value;
  profile.height = Number(heightInput.value);
  profile.weight = Number(weightInput.value);
  profile.activityLevel = activityInput.value;

  saveData("profile", profile);
  runBmiCalculation();
  runCalorieCalculation();

  showToast("Profile updated successfully.", "success");
  goToScreen("screen-profile-page");
  renderProfilePage();
}

function openChangeGoal() {
  const goalKey = getData("goalKey");
  document.querySelectorAll("#changeGoalScreen .goal-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.goal === goalKey);
  });
  goToScreen("screen-change-goal");
}

function selectChangeGoal(goalKey) {
  document.querySelectorAll("#changeGoalScreen .goal-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.goal === goalKey);
  });
  saveData("goalKey", goalKey);
  saveData("goal", GOAL_LABELS[goalKey]);
}

function confirmChangeGoal() {
  runCalorieCalculation();
  renderWorkoutPlan();
  renderDietPlan();
  showToast(`Goal changed to ${getData("goal")}.`, "success");
  goToScreen("screen-profile-page");
  renderProfilePage();
}

function renderProfilePage() {
  const user = getCurrentUser();
  const profile = getData("profile");
  if (!user || !profile) return;

  document.getElementById("ppName").textContent = user.name;
  document.getElementById("ppEmail").textContent = user.email;
  document.getElementById("ppAge").textContent = profile.age;
  document.getElementById("ppGender").textContent = profile.gender;
  document.getElementById("ppHeight").textContent = profile.height + " cm";
  document.getElementById("ppWeight").textContent = profile.weight + " kg";
  document.getElementById("ppGoal").textContent = getData("goal", "-");
  document.getElementById("ppBmi").textContent = getData("bmi", "-");
  document.getElementById("ppCalories").textContent = getData("calories", "-") + " kcal";
}

function resetAppData() {
  clearAppData();
  showToast("All fitness data has been reset.", "success");
  goToScreen("screen-welcome");
}
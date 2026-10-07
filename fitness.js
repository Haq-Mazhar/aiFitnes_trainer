const workoutPlans = {
  beginner: {
    Monday: ["Bodyweight Squats", "Push-ups", "Plank", "Walking"],
    Tuesday: ["Rest / Light Walking"],
    Wednesday: ["Lunges", "Push-ups", "Glute Bridge", "Plank"],
    Thursday: ["Rest"],
    Friday: ["Squats", "Mountain Climbers", "Push-ups", "Plank"],
    Saturday: ["Light Cardio"],
    Sunday: ["Rest"],
  },
  intermediate: {
    Monday: ["Jump Squats", "Push-ups", "Plank", "Jogging"],
    Tuesday: ["Lunges", "Burpees", "Side Plank"],
    Wednesday: ["Rest / Stretching"],
    Thursday: ["Squats", "Mountain Climbers", "Plank", "Bicycle Crunches"],
    Friday: ["Push-ups", "Glute Bridge", "Jump Rope"],
    Saturday: ["Moderate Cardio"],
    Sunday: ["Rest"],
  },
  advanced: {
    Monday: ["Jump Squats", "Diamond Push-ups", "Plank to Push-up", "Sprint Intervals"],
    Tuesday: ["Burpees", "Lunges", "Side Plank", "Jump Rope"],
    Wednesday: ["Mountain Climbers", "Push-ups", "Bicycle Crunches", "Wall Sit"],
    Thursday: ["Rest / Active Recovery"],
    Friday: ["Squats", "Burpees", "Plank", "Sprint Intervals"],
    Saturday: ["High-Intensity Cardio"],
    Sunday: ["Rest"],
  },
};

const dietPlans = {
  lose: {
    Breakfast: "Oats with berries and egg whites",
    Lunch: "Grilled chicken, brown rice, mixed salad",
    Snack: "Greek yogurt with a handful of nuts",
    Dinner: "Grilled fish with steamed vegetables",
  },
  gain: {
    Breakfast: "Oats + Eggs + Banana + Peanut Butter",
    Lunch: "Chicken, rice, beans and salad",
    Snack: "Protein shake with fruit",
    Dinner: "Beef or chicken with sweet potato and vegetables",
  },
  healthy: {
    Breakfast: "Oats + Eggs + Fruit",
    Lunch: "Chicken + Rice + Salad",
    Snack: "Fruit + Yogurt",
    Dinner: "Grilled Chicken + Vegetables",
  },
  improve: {
    Breakfast: "Whole grain toast, eggs, avocado",
    Lunch: "Turkey wrap with vegetables and quinoa",
    Snack: "Mixed nuts and fruit",
    Dinner: "Salmon, brown rice, greens",
  },
};

function getWorkoutLevelForProfile(profile) {
  if (!profile) return "beginner";
  if (profile.activityLevel === "active") return "advanced";
  if (profile.activityLevel === "moderate") return "intermediate";
  return "beginner";
}

function buildWorkoutPlanHtml(plan) {
  return Object.keys(plan)
    .map((day) => {
      const exercises = plan[day];
      return `
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100 plan-card">
          <div class="card-body">
            <h6 class="card-title text-uppercase fw-bold text-primary-teal">${day}</h6>
            <ul class="list-unstyled mb-0">
              ${exercises.map((ex) => `<li>• ${ex}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

function renderWorkoutPlan() {
  const profile = getData("profile");
  const level = getWorkoutLevelForProfile(profile);
  saveData("workoutLevel", level);

  const plan = workoutPlans[level];
  const html = buildWorkoutPlanHtml(plan);

  ["workoutPlanList", "workoutPlanList2"].forEach((id) => {
    const container = document.getElementById(id);
    if (container) container.innerHTML = html;
  });

  const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);
  ["workoutLevelLabel", "workoutLevelLabel2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = levelLabel;
  });

  saveData("workoutPlan", plan);
}

function continueToDietPlan() {
  renderDietPlan();
  goToScreen("screen-diet-plan");
}

function renderDietPlan() {
  const goalKey = getData("goalKey", "healthy");
  const plan = dietPlans[goalKey] || dietPlans.healthy;

  const html = Object.keys(plan)
    .map(
      (meal) => `
      <div class="col-md-6 mb-3">
        <div class="card h-100 plan-card">
          <div class="card-body">
            <h6 class="card-title fw-bold text-primary-teal">${meal}</h6>
            <p class="mb-0">${plan[meal]}</p>
          </div>
        </div>
      </div>`
    )
    .join("");

  ["dietPlanList", "dietPlanList2"].forEach((id) => {
    const container = document.getElementById(id);
    if (container) container.innerHTML = html;
  });

  saveData("dietPlan", plan);
}

function continueToDashboard() {
  saveData("profileComplete", true);
  goToScreen("screen-dashboard");
  refreshDashboard();
}
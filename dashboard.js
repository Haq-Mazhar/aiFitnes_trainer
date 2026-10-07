const WATER_TARGET = 8;
const MEAL_NAMES = ["Breakfast", "Lunch", "Snack", "Dinner"];
const HABIT_NAMES = ["Drink enough water", "Complete workout", "Eat healthy food", "Sleep well"];

function getTodayRecord() {
  const today = getTodayDate();
  const record = getData("dailyRecord", null);

  if (record && record.date === today) {
    return record;
  }

  const fresh = {
    date: today,
    water: 0,
    meals: { Breakfast: false, Lunch: false, Snack: false, Dinner: false },
    workoutCompleted: false,
    completedExercises: [],
    habits: {
      "Drink enough water": false,
      "Complete workout": false,
      "Eat healthy food": false,
      "Sleep well": false,
    },
  };
  saveData("dailyRecord", fresh);
  return fresh;
}

function saveTodayRecord(record) {
  saveData("dailyRecord", record);
}

function refreshDashboard() {
  const user = getCurrentUser();
  const profile = getData("profile");
  if (!user || !profile) return;

  document.getElementById("dashboardGreeting").textContent = `Good day, ${user.name}!`;

  renderWaterTracker();
  renderMealTracker();
  renderWorkoutTracker();
  renderHabitTracker();
  updateStreakDisplay();

  document.getElementById("statCalories").textContent = getData("calories", "-");
  document.getElementById("statBmi").textContent = getData("bmi", "-");
  document.getElementById("statGoal").textContent = getData("goal", "-");

  renderProgressDashboard();
}

function renderWaterTracker() {
  const record = getTodayRecord();
  document.getElementById("waterCount").textContent = `${record.water} / ${WATER_TARGET} glasses`;
  document.getElementById("waterProgressBar").style.width =
    Math.min(100, (record.water / WATER_TARGET) * 100) + "%";
  document.getElementById("waterMinusBtn").disabled = record.water <= 0;
  document.getElementById("waterPlusBtn").disabled = record.water >= WATER_TARGET;
}

function addWater(amount) {
  const record = getTodayRecord();
  let newValue = record.water + amount;

  if (newValue < 0) newValue = 0;  
  if (newValue > WATER_TARGET) newValue = WATER_TARGET;  

  record.water = newValue;
  saveTodayRecord(record);
  renderWaterTracker();
  showToast("Water updated.", "success");

  checkAndUpdateHabit("Drink enough water", record.water >= WATER_TARGET);
  recordDailyWaterHistory(record.water);
  evaluateStreak();
}

function recordDailyWaterHistory(waterValue) {
  const history = getData("waterHistory", {});
  history[getTodayDate()] = waterValue;
  saveData("waterHistory", history);
}

function renderMealTracker() {
  const record = getTodayRecord();
  const container = document.getElementById("mealTrackerList");
  container.innerHTML = "";

  MEAL_NAMES.forEach((meal) => {
    const done = record.meals[meal];
    const item = document.createElement("div");
    item.className = "form-check meal-item d-flex align-items-center justify-content-between mb-2";
    item.innerHTML = `
      <label class="form-check-label ${done ? "text-decoration-line-through text-muted" : ""}" for="meal-${meal}">
        ${meal}
      </label>
      <input class="form-check-input" type="checkbox" id="meal-${meal}" ${done ? "checked" : ""} onchange="toggleMeal('${meal}')">
    `;
    container.appendChild(item);
  });

  const completedCount = MEAL_NAMES.filter((m) => record.meals[m]).length;
  document.getElementById("mealCount").textContent = `${completedCount} / ${MEAL_NAMES.length} completed`;
}

function toggleMeal(mealName) {
  const record = getTodayRecord();
  record.meals[mealName] = !record.meals[mealName];
  saveTodayRecord(record);
  renderMealTracker();

  showToast(
    record.meals[mealName] ? `${mealName} marked as completed.` : `${mealName} marked as not completed.`,
    "success"
  );

  incrementLifetimeMealsIfNeeded();
  checkAndUpdateHabit("Eat healthy food", MEAL_NAMES.every((m) => record.meals[m]));
  evaluateStreak();
}

function incrementLifetimeMealsIfNeeded() {
  const total = getData("lifetimeMealsCompleted", 0);
  const record = getTodayRecord();
  const completedNow = MEAL_NAMES.filter((m) => record.meals[m]).length;
  const trackedToday = getData("mealsTrackedToday", { date: record.date, count: 0 });

  if (trackedToday.date !== record.date) {
    trackedToday.date = record.date;
    trackedToday.count = 0;
  }

  const delta = completedNow - trackedToday.count;
  if (delta !== 0) {
    saveData("lifetimeMealsCompleted", total + delta);
    trackedToday.count = completedNow;
    saveData("mealsTrackedToday", trackedToday);
  }
}

function getTodaysExerciseList() {
  const plan = getData("workoutPlan");
  if (!plan) return [];
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return plan[dayName] || [];
}

function renderWorkoutTracker() {
  const record = getTodayRecord();
  const exercises = getTodaysExerciseList();

  let html;
  if (exercises.length === 0) {
    html = `<p class="text-muted mb-0">No workout scheduled today. Enjoy the rest day!</p>`;
  } else {
    html = exercises
      .map((exercise) => {
        const done = record.completedExercises.includes(exercise);
        return `
        <div class="form-check d-flex align-items-center justify-content-between mb-2">
          <label class="form-check-label ${done ? "text-decoration-line-through text-muted" : ""}" for="ex-${exercise}">
            ${exercise}
          </label>
          <input class="form-check-input" type="checkbox" id="ex-${exercise}" ${done ? "checked" : ""} onchange="toggleExercise('${exercise}')">
        </div>`;
      })
      .join("");
  }

  ["workoutTrackerList", "workoutTrackerList2"].forEach((id) => {
    const container = document.getElementById(id);
    if (container) container.innerHTML = html;
  });

  const statusEl = document.getElementById("workoutStatus");
  if (statusEl) {
    statusEl.textContent = exercises.length === 0 ? "Rest Day" : record.workoutCompleted ? "Completed ✓" : "Not Completed";
  }
}

function toggleExercise(exerciseName) {
  const record = getTodayRecord();
  const idx = record.completedExercises.indexOf(exerciseName);

  if (idx === -1) {
    record.completedExercises.push(exerciseName);
  } else {
    record.completedExercises.splice(idx, 1);
  }

  const todaysExercises = getTodaysExerciseList();
  const wasCompleted = record.workoutCompleted;
  record.workoutCompleted =
    todaysExercises.length > 0 && todaysExercises.every((ex) => record.completedExercises.includes(ex));

  saveTodayRecord(record);
  renderWorkoutTracker();

  if (record.workoutCompleted && !wasCompleted) {
    showToast("Workout completed!", "success");
    incrementLifetimeWorkouts();
  }

  checkAndUpdateHabit("Complete workout", record.workoutCompleted);
  evaluateStreak();
}

function incrementLifetimeWorkouts() {
  const total = getData("lifetimeWorkoutsCompleted", 0);
  saveData("lifetimeWorkoutsCompleted", total + 1);
}

function renderHabitTracker() {
  const record = getTodayRecord();
  const container = document.getElementById("habitTrackerList");
  container.innerHTML = "";

  HABIT_NAMES.forEach((habit) => {
    const done = record.habits[habit];
    const item = document.createElement("div");
    item.className = "form-check d-flex align-items-center justify-content-between mb-2";
    item.innerHTML = `
      <label class="form-check-label ${done ? "text-decoration-line-through text-muted" : ""}" for="habit-${habit}">
        ${habit}
      </label>
      <input class="form-check-input" type="checkbox" id="habit-${habit}" ${done ? "checked" : ""} onchange="toggleHabit('${habit}')">
    `;
    container.appendChild(item);
  });

  const completedCount = HABIT_NAMES.filter((h) => record.habits[h]).length;
  document.getElementById("habitCount").textContent = `${completedCount} / ${HABIT_NAMES.length} habits completed`;
}

function toggleHabit(habitName) {
  const record = getTodayRecord();
  record.habits[habitName] = !record.habits[habitName];
  saveTodayRecord(record);
  renderHabitTracker();
  evaluateStreak();
}

function checkAndUpdateHabit(habitName, isDone) {
  const record = getTodayRecord();
  if (record.habits[habitName] !== isDone) {
    record.habits[habitName] = isDone;
    saveTodayRecord(record);
    renderHabitTracker();
  }
}

function evaluateStreak() {
  const record = getTodayRecord();
  const allHabitsDone = HABIT_NAMES.every((h) => record.habits[h]);
  if (!allHabitsDone) return; 

  const streakData = getData("streak", { streak: 0, lastCompletedDate: null });
  const today = getTodayDate();

  if (streakData.lastCompletedDate === today) {
    return; 
  }

  if (streakData.lastCompletedDate === getYesterdayDate()) {
    streakData.streak += 1;
  } else {
    streakData.streak = 1;
  }

  streakData.lastCompletedDate = today;
  saveData("streak", streakData);
  updateStreakDisplay();
  showToast(`Daily goals complete! Streak: ${streakData.streak} day(s).`, "success");
}

function updateStreakDisplay() {
  const streakData = getData("streak", { streak: 0, lastCompletedDate: null });

  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  if (
    streakData.lastCompletedDate &&
    streakData.lastCompletedDate !== today &&
    streakData.lastCompletedDate !== yesterday
  ) {
    streakData.streak = 0;
    saveData("streak", streakData);
  }

  document.getElementById("statStreak").textContent = `${streakData.streak} Days`;
}

function renderProgressDashboard() {
  const profile = getData("profile");
  if (!profile) return;

  const startingWeight = profile.startingWeight ?? profile.weight;
  const currentWeight = profile.weight;
  const weightChange = Math.round((currentWeight - startingWeight) * 10) / 10;

  document.getElementById("progCurrentWeight").textContent = currentWeight + " kg";
  document.getElementById("progStartingWeight").textContent = startingWeight + " kg";

  const changeEl = document.getElementById("progWeightChange");
  changeEl.textContent = (weightChange > 0 ? "+" : "") + weightChange + " kg";
  changeEl.className = weightChange < 0 ? "text-success fw-bold" : weightChange > 0 ? "text-danger fw-bold" : "fw-bold";

  document.getElementById("progWorkouts").textContent = getData("lifetimeWorkoutsCompleted", 0);
  document.getElementById("progMeals").textContent = getData("lifetimeMealsCompleted", 0);

  const streakData = getData("streak", { streak: 0 });
  document.getElementById("progStreak").textContent = `${streakData.streak} days`;

  const waterHistory = getData("waterHistory", {});
  const values = Object.values(waterHistory);
  const avgWater = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  document.getElementById("progAvgWater").textContent = `${Math.round(avgWater * 10) / 10} glasses/day`;

  const record = getTodayRecord();
  const habitsCompleted = HABIT_NAMES.filter((h) => record.habits[h]).length;
  document.getElementById("progHabits").textContent = `${habitsCompleted} / ${HABIT_NAMES.length}`;

  renderEmptyStates(record);
}

function renderEmptyStates(record) {
  const noWorkoutMsg = document.getElementById("emptyWorkoutMsg");
  if (noWorkoutMsg) {
    noWorkoutMsg.classList.toggle("d-none", record.workoutCompleted || getTodaysExerciseList().length === 0);
  }

  const noMealsMsg = document.getElementById("emptyMealsMsg");
  if (noMealsMsg) {
    const anyMeal = MEAL_NAMES.some((m) => record.meals[m]);
    noMealsMsg.classList.toggle("d-none", anyMeal);
  }
}
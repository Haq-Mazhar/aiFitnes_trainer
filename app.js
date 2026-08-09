let authMode = "signup"; 
let userProfile = {
  name: "",
  email: "",
  age: 20,
  weight: 70,
  height: 175,
  goal: "Weight Loss"
};

 
function nextStep(stepNumber) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));
  
  const targetScreen = document.getElementById(`step-${stepNumber}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

 
function startAuth(mode) {
  authMode = mode;
  updateAuthUI();
  nextStep(2);
}

 
function toggleAuthMode() {
  authMode = authMode === "signup" ? "login" : "signup";
  updateAuthUI();
}

 
function updateAuthUI() {
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const nameGroup = document.getElementById('group-signup-name');
  const confirmGroup = document.getElementById('group-signup-confirm');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleLink = document.getElementById('auth-toggle-link');

  if (authMode === "signup") {
    title.innerText = "Create Account";
    subtitle.innerText = "Sign up to track your daily health stats.";
    nameGroup.style.display = "flex";
    confirmGroup.style.display = "flex";
    submitBtn.innerText = "Sign Up";
    toggleText.innerText = "Already have an account?";
    toggleLink.innerText = "Log In";
  } else {
    title.innerText = "Welcome Back";
    subtitle.innerText = "Log in to view your stored progress.";
    nameGroup.style.display = "none";
    confirmGroup.style.display = "none";
    submitBtn.innerText = "Log In";
    toggleText.innerText = "Don't have an account?";
    toggleLink.innerText = "Sign Up";
  }
}

 
function handleAuthSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;

  if (authMode === "signup") {
    const name = document.getElementById('reg-name').value || "User";
    const confirmPass = document.getElementById('user-confirm-password').value;

    if (password !== confirmPass) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    
    userProfile.name = name;
    userProfile.email = email;
    
     
    nextStep(3);
  } else {
    userProfile.email = email;
    userProfile.name = email.split('@')[0];  
    nextStep(3);
  }
}


function calculateMetrics() {
  const age = parseFloat(document.getElementById('user-age').value) || 20;
  const weight = parseFloat(document.getElementById('user-weight').value) || 70;
  const height = parseFloat(document.getElementById('user-height').value) || 170;
  const goal = document.getElementById('user-goal').value;

  userProfile.age = age;
  userProfile.weight = weight;
  userProfile.height = height;
  userProfile.goal = goal;


  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  
  let status = "Normal weight";
  if (bmi < 18.5) status = "Underweight";
  else if (bmi >= 25) status = "Overweight";


  let calories = 2000;
  if (goal === "Weight Loss") calories = 1700;
  if (goal === "Muscle Gain") calories = 2500;

  document.getElementById('bmi-val').innerText = bmi;
  document.getElementById('bmi-status').innerText = status;
  document.getElementById('calorie-val').innerText = calories;
}


function generatePlan() {
  const name = userProfile.name || "User";
  const goal = userProfile.goal;

  document.getElementById('dash-greeting').innerText = `Welcome back, ${name}!`;

  if (goal === "Weight Loss") {
    document.getElementById('workout-plan-text').innerText = "30 mins Cardio + High-Intensity Interval Training (HIIT) 4x per week.";
    document.getElementById('diet-plan-text').innerText = "Caloric deficit diet rich in lean proteins, high fiber, and complex carbs.";
  } else if (goal === "Muscle Gain") {
    document.getElementById('workout-plan-text').innerText = "Progressive Overload Resistance Training 5x per week.";
    document.getElementById('diet-plan-text').innerText = "Caloric surplus diet focused on high protein intake (1.6-2.0g per kg body weight).";
  } else {
    document.getElementById('workout-plan-text').innerText = "Balanced Mix of Cardio & Weight Training 3x-4x per week.";
    document.getElementById('diet-plan-text').innerText = "Maintenance caloric intake with a balanced macronutrient split.";
  }
}


function switchTab(tabId, element) {
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));

  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  element.classList.add('active');
}
const chatbotResponses = {
  workout: "Start with light exercises and focus on proper form.",
  diet: "Try to include protein, vegetables, fruits and enough water in your meals.",
  water: "Remember to drink water throughout the day.",
  motivation: "Small progress every day can create big results. Keep going!",
};

const chatbotQuestionLabels = {
  workout: "Workout Tips",
  diet: "Diet Tips",
  water: "Water",
  motivation: "Motivation",
};

function initChatbot() {
  const chatWindow = document.getElementById("chatWindow");
  if (chatWindow.children.length === 0) {
    appendChatMessage("bot", "Hi! I'm your fitness coach bot. Pick a topic below and I'll share a quick tip.");
  }
}

function askChatbot(topicKey) {
  const chatWindow = document.getElementById("chatWindow");

  appendChatMessage("user", chatbotQuestionLabels[topicKey]);
  
  setTimeout(() => {
    appendChatMessage("bot", chatbotResponses[topicKey]);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 400);

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendChatMessage(sender, message) {
  const chatWindow = document.getElementById("chatWindow");

  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "chat-bubble chat-bubble-user" : "chat-bubble chat-bubble-bot";
  bubble.textContent = message;

  const wrapper = document.createElement("div");
  wrapper.className = sender === "user" ? "d-flex justify-content-end mb-2" : "d-flex justify-content-start mb-2";
  wrapper.appendChild(bubble);

  chatWindow.appendChild(wrapper);
}
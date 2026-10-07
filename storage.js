const APP_PREFIX = "aifc_"; 

function saveData(key, data) {
  localStorage.setItem(APP_PREFIX + key, JSON.stringify(data));
}

function getData(key, fallback = null) {
  const raw = localStorage.getItem(APP_PREFIX + key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("storage.js: could not parse key", key, err);
    return fallback;
  }
}

function removeData(key) {
  localStorage.removeItem(APP_PREFIX + key);
}

function clearAppData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(APP_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

function formatDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayDate() {
  return formatDate(new Date());
}

function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

function isSameDay(dateStrA, dateStrB) {
  return dateStrA === dateStrB;
}
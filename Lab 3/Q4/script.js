const logList = document.getElementById("activityLog");
const warningBox = document.getElementById("warning");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");

let activities = [];
let clickCount = 0;
const CLICK_THRESHOLD = 10;

/* ---------- Log Function ---------- */
function logActivity(type, details) {
  const activity = {
    type,
    details,
    time: new Date().toLocaleTimeString()
  };

  activities.push(activity);
  renderLog();

  if (type === "click") {
    clickCount++;
    if (clickCount > CLICK_THRESHOLD) {
      warningBox.textContent = "⚠️ Suspicious activity detected: too many clicks!";
    }
  }
}

/* ---------- Render Log ---------- */
function renderLog() {
  logList.innerHTML = "";
  activities.slice(-20).forEach(a => {
    const li = document.createElement("li");
    li.textContent = `[${a.time}] ${a.type.toUpperCase()} - ${a.details}`;
    logList.appendChild(li);
  });
}

/* ---------- Event Tracking ---------- */

// Capturing phase
document.addEventListener("click", e => {
  logActivity("click", `Clicked on ${e.target.tagName}`);
}, true);

// Bubbling phase
document.addEventListener("keydown", e => {
  logActivity("key", `Key pressed: ${e.key}`);
});

// Focus tracking
document.addEventListener("focusin", e => {
  logActivity("focus", `Focused on ${e.target.tagName}`);
});

/* ---------- Reset ---------- */
resetBtn.addEventListener("click", () => {
  activities = [];
  clickCount = 0;
  warningBox.textContent = "";
  renderLog();
});

/* ---------- Export ---------- */
exportBtn.addEventListener("click", () => {
  let text = activities
    .map(a => `[${a.time}] ${a.type.toUpperCase()} - ${a.details}`)
    .join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "activity-log.txt";
  link.click();
});
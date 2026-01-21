const stages = document.querySelectorAll(".stage");
const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("multiForm");
const summary = document.getElementById("summary");

let currentStage = 0;

/* Temporary data store */
const data = {};

/* ---------- Prevent Enter Key Submit ---------- */
form.addEventListener("keydown", e => {
  if (e.key === "Enter") e.preventDefault();
});

/* ---------- Show Stage ---------- */
function showStage(index) {
  stages.forEach((s, i) => s.classList.toggle("active", i === index));
  progressBar.style.width = ((index + 1) / stages.length) * 100 + "%";
  prevBtn.style.display = index === 0 ? "none" : "inline-block";
  nextBtn.classList.toggle("hidden", index === stages.length - 1);
  submitBtn.classList.toggle("hidden", index !== stages.length - 1);
}

/* ---------- Email Validation ---------- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- Stage Validation ---------- */
function validateStage(index) {
  let valid = true;
  const inputs = stages[index].querySelectorAll("input, select");

  inputs.forEach(input => {
    const error = input.nextElementSibling;
    error.textContent = "";

    // Required check
    if (!input.value.trim()) {
      error.textContent = "This field is required";
      valid = false;
      return;
    }

    // Email check
    if (input.id === "email" && !isValidEmail(input.value.trim())) {
      error.textContent = "Enter a valid email address";
      valid = false;
      return;
    }

    // Age check
    if (input.id === "age" && input.value < 18) {
      error.textContent = "Must be 18 or above";
      valid = false;
      return;
    }

    // Password match
    if (input.id === "confirm" && input.value !== password.value) {
      error.textContent = "Passwords do not match";
      valid = false;
      return;
    }

    // Save valid data
    data[input.id] = input.value.trim();
  });

  return valid;
}

/* ---------- Navigation ---------- */
nextBtn.addEventListener("click", () => {
  if (validateStage(currentStage)) {
    currentStage++;

    if (currentStage === stages.length - 1) {
      summary.innerHTML = `
        <li>Name: ${data.name}</li>
        <li>Email: ${data.email}</li>
        <li>Age: ${data.age}</li>
        <li>Role: ${data.role}</li>
      `;
    }

    showStage(currentStage);
  } else {
    alert("Please fix errors before proceeding.");
  }
});

prevBtn.addEventListener("click", () => {
  currentStage--;
  showStage(currentStage);
});

/* ---------- Submit ---------- */
form.addEventListener("submit", e => {
  e.preventDefault();
  alert("Form submitted successfully!");
});

/* ---------- Init ---------- */
showStage(currentStage);
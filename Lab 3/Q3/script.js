const form = document.getElementById("surveyForm");
const submitBtn = document.getElementById("submitBtn");

/* ---------- Question Data ---------- */
const questions = [
  {
    id: "q1",
    text: "What is your name?",
    type: "text",
    required: true,
    maxLength: 20
  },
  {
    id: "q2",
    text: "Select your gender",
    type: "radio",
    required: true,
    options: ["Male", "Female", "Other"]
  },
  {
    id: "q3",
    text: "Which skills do you have?",
    type: "checkbox",
    required: true,
    minSelect: 2,
    options: ["C/C++", "HTML/CSS", "Java", "JavaScript", "Python"]
  }
];

/* ---------- Generate Form ---------- */
questions.forEach(q => {
  const div = document.createElement("div");
  div.className = "question";
  div.id = q.id;

  const label = document.createElement("label");
  label.textContent = q.text;
  div.appendChild(label);

  if (q.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = q.maxLength;
    div.appendChild(input);
  }

  if (q.type === "radio" || q.type === "checkbox") {
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    q.options.forEach(opt => {
      const optLabel = document.createElement("label");
      const input = document.createElement("input");
      input.type = q.type;
      input.name = q.id;
      input.value = opt;
      optLabel.appendChild(input);
      optLabel.append(` ${opt}`);
      optionsDiv.appendChild(optLabel);
    });
    div.appendChild(optionsDiv);
  }

  const error = document.createElement("small");
  div.appendChild(error);

  form.appendChild(div);
});

/* ---------- Validation ---------- */
function validateSurvey() {
  let valid = true;

  questions.forEach(q => {
    const container = document.getElementById(q.id);
    const error = container.querySelector("small");
    error.textContent = "";

    if (q.type === "text") {
      const input = container.querySelector("input");
      if (q.required && !input.value.trim()) {
        error.textContent = "This field is required";
        input.classList.add("invalid");
        valid = false;
      } else {
        input.classList.remove("invalid");
      }
    }

    if (q.type === "radio") {
      const checked = container.querySelector("input:checked");
      if (q.required && !checked) {
        error.textContent = "Please select one option";
        valid = false;
      }
    }

    if (q.type === "checkbox") {
      const checked = container.querySelectorAll("input:checked");
      if (checked.length < q.minSelect) {
        error.textContent = `Select at least ${q.minSelect} options`;
        valid = false;
      }
    }
  });

  return valid;
}

/* ---------- Submit ---------- */
submitBtn.addEventListener("click", () => {
  if (validateSurvey()) {
    alert("Survey submitted successfully!");
    form.reset();
  } else {
    alert("Please fix the errors before submitting.");
  }
});
const form = document.getElementById("form");
const role = document.getElementById("role");
const skillsBox = document.getElementById("skillsBox");
const password = document.getElementById("password");
const confirm = document.getElementById("confirm");
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("change", () => {
    const type = showPassword.checked ? "text" : "password";
    password.type = type;
    confirm.type = type;
});

function showError(input, msg) {
    input.classList.add("invalid");
    input.classList.remove("valid");
    input.nextElementSibling.textContent = msg;
}

function showSuccess(input) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    input.nextElementSibling.textContent = "";
}

function emailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordValid(pwd, role) {
    if (role === "admin") {
        return (
            pwd.length >= 10 &&
            /[A-Z]/.test(pwd) &&
            /\d/.test(pwd) &&
            /\W/.test(pwd)
        );
    }
    return pwd.length >= 6;
}

/* ---------- Field Validation ---------- */
function validateField(input) {
    const id = input.id;
    const value = input.value.trim();

    switch (id) {
        case "name":
            value ? showSuccess(input) : showError(input, "Name is required");
            break;

        case "email":
            if (!value) showError(input, "Email is required");
            else if (!emailValid(value)) showError(input, "Invalid email format");
            else showSuccess(input);
            break;

        case "age":
            value >= 18 ? showSuccess(input) : showError(input, "Must be 18 or above");
            break;

        case "role":
            if (!value) {
                showError(input, "Please select a role");
            } else {
                showSuccess(input);
                skillsBox.classList.toggle("hidden", value === "student");
                validateField(password); // re-check password when role changes
            }
            break;

        case "skills":
            if (!skillsBox.classList.contains("hidden") && !value) {
                showError(input, "Skills are required");
            } else {
                showSuccess(input);
            }
            break;

        case "password":
            if (!value) {
                showError(input, "Password is required");
            } else if (!passwordValid(value, role.value)) {
                showError(input, "Password not strong enough");
            } else {
                showSuccess(input);
            }
            validateField(confirm); // re-check confirm password
            break;

        case "confirm":
            if (!value) {
                showError(input, "Please confirm password");
            } else if (value !== password.value) {
                showError(input, "Passwords do not match");
            } else {
                showSuccess(input);
            }
            break;
    }
}

/* ---------- Real-Time Validation ---------- */
form.addEventListener("input", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
        validateField(e.target);
    }
});

/* ---------- Final Submission ---------- */
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all fields
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => validateField(input));

    // Check errors
    const errors = form.querySelectorAll(".invalid");

    if (errors.length > 0) {
        alert("Please fix the highlighted errors before submitting.");
        return;
    }

    // Success
    alert("Registration Successful!");
    form.reset();
    skillsBox.classList.add("hidden");
    document.querySelectorAll(".valid").forEach(el => el.classList.remove("valid"));
});
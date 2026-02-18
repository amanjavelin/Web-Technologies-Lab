const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const usernameFeedback = document.getElementById("usernameFeedback");

let isUsernameAvailable = false;
let debounceTimer;

usernameInput.addEventListener("input", () => {

    clearTimeout(debounceTimer);
    const username = usernameInput.value.trim();

    if (username.length < 3) {
        showUsernameMessage("Minimum 3 characters", false);
        return;
    }

    debounceTimer = setTimeout(() => {
        checkUsername(username);
    }, 500);
});

function checkUsername(username) {

    usernameFeedback.textContent = "Checking...";
    usernameFeedback.style.color = "#f59e0b";

    fetch("users.json")
        .then(res => res.json())
        .then(data => {

            setTimeout(() => {

                const exists = data.usernames.includes(username);

                if (exists) {
                    showUsernameMessage("Username already taken", false);
                } else {
                    showUsernameMessage("Username available ✓", true);
                }

            }, 700); // simulate delay
        })
        .catch(() => {
            showUsernameMessage("Error checking username", false);
        });
}

function showUsernameMessage(message, available) {
    usernameFeedback.textContent = message;

    if (available) {
        usernameFeedback.style.color = "#22c55e";
        usernameInput.classList.add("valid");
        usernameInput.classList.remove("invalid");
        isUsernameAvailable = true;
    } else {
        usernameFeedback.style.color = "#ef4444";
        usernameInput.classList.add("invalid");
        usernameInput.classList.remove("valid");
        isUsernameAvailable = false;
    }
}

form.addEventListener("submit", function (e) {

    if (!isUsernameAvailable) {
        e.preventDefault();
        alert("Please choose an available username");
        return;
    }

    alert("Registration successful!");
});
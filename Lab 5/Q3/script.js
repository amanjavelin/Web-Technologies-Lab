let students = [];

async function loadStudents() {
    try {
        const response = await fetch("students.json");
        if (!response.ok) {
            throw new Error("Failed to load JSON file");
        }
        students = await response.json();
        displayStudents();
        showMessage("Students loaded successfully.", false);
    } catch (error) {
        showMessage("JSON Parsing / Fetch Error: " + error.message, true);
    }
}

function displayStudents() {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";
    if (students.length === 0) {
        showMessage("No student records found.", true);
        return;
    }
    students.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
        `;
        table.appendChild(row);
    });
}

function validateInputs(requireAll = true) {
    if (!studentId.value) {
        showMessage("Student ID is required.", true);
        return false;
    }
    if (requireAll && (!studentName.value || !studentCourse.value || !studentMarks.value)) {
        showMessage("All fields must be filled.", true);
        return false;
    }
    if (studentMarks.value && (studentMarks.value < 0 || studentMarks.value > 100)) {
        showMessage("Marks must be between 0 and 100.", true);
        return false;
    }
    return true;
}

function addStudent() {
    if (!validateInputs()) return;
    if (students.some(s => s.id === studentId.value)) {
        showMessage("Student ID already exists.", true);
        return;
    }
    const newStudent = {
        id: studentId.value,
        name: studentName.value,
        course: studentCourse.value,
        marks: Number(studentMarks.value)
    };
    students.push(newStudent);
    displayStudents();
    showMessage("Student added successfully.", false);
}

function updateStudent() {
    if (!validateInputs(false)) return;
    const student = students.find(s => s.id === studentId.value);
    if (!student) {
        showMessage("Student not found.", true);
        return;
    }
    if (studentCourse.value) student.course = studentCourse.value;
    if (studentMarks.value) student.marks = Number(studentMarks.value);

    displayStudents();
    showMessage("Student updated successfully.", false);
}

function deleteStudent() {
    if (!validateInputs(false)) return;
    const index = students.findIndex(s => s.id === studentId.value);
    if (index === -1) {
        showMessage("Student not found.", true);
        return;
    }
    students.splice(index, 1);
    displayStudents();
    showMessage("Student deleted successfully.", false);
}

function showMessage(msg, isError) {
    const message = document.getElementById("message");
    message.textContent = msg;
    message.style.color = isError ? "red" : "green";
}

window.onload = loadStudents;
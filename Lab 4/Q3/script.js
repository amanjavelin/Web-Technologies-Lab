const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const message = document.getElementById("message");

let students = [];

window.addEventListener("DOMContentLoaded", () => {
    fetch("students.json")
        .then(res => {
            if (!res.ok) throw new Error("Server Error");
            return res.json();
        })
        .then(data => {
            students = data.students;
            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
        })
        .catch(() => {
            showMessage("Failed to load students (500)", "red");
        });
});

if (localStorage.getItem("students")) {
    students = JSON.parse(localStorage.getItem("students"));
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = studentId.value;
    const nameVal = name.value;
    const dept = department.value;
    const marksVal = marks.value;
    if (students.find(s => s.id === id)) {
        showMessage("Student ID already exists (404)", "red");
        return;
    }
    const newStudent = { id, name: nameVal, department: dept, marks: marksVal };
    students.push(newStudent);
    saveAndRefresh();
    showMessage("Student added successfully (200)", "green");
    form.reset();
});

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) {
        showMessage("Student not found (404)", "red");
        return;
    }
    studentId.value = student.id;
    name.value = student.name;
    department.value = student.department;
    marks.value = student.marks;
    deleteStudent(id);
    showMessage("Edit the student and click Add to update", "orange");
}

function deleteStudent(id) {
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
        showMessage("Student not found (404)", "red");
        return;
    }
    students.splice(index, 1);
    saveAndRefresh();
    showMessage("Student deleted (200)", "green");
}

function displayStudents() {
    table.innerHTML = "";
    students.forEach(student => {
        const row = `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.department}</td>
                <td>${student.marks}</td>
                <td>
                    <button class="action-btn edit" onclick="editStudent('${student.id}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            </tr>
        `;

        table.innerHTML += row;
    });
}

function saveAndRefresh() {
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}
let xmlData = null;

function loadEmployees() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "employees.xml", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            xmlData = xhr.responseXML;

            if (!xmlData) {
                showMessage("Malformed XML file", true);
                return;
            }

            displayEmployees();
            showMessage("Employees loaded successfully", false);
        } else {
            showMessage("Error loading XML file", true);
        }
    };
    xhr.send();
}

function displayEmployees() {
    const table = document.getElementById("employeeTable");
    table.innerHTML = "";
    const employees = xmlData.getElementsByTagName("employee");
    if (employees.length === 0) {
        showMessage("No employees found", true);
        return;
    }
    for (let emp of employees) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${emp.getElementsByTagName("id")[0].textContent}</td>
            <td>${emp.getElementsByTagName("name")[0].textContent}</td>
            <td>${emp.getElementsByTagName("department")[0].textContent}</td>
            <td>${emp.getElementsByTagName("salary")[0].textContent}</td>
        `;

        table.appendChild(row);
    }
}

function addEmployee() {
    if (!xmlData) return;
    const employeesNode = xmlData.getElementsByTagName("employees")[0];
    const newEmp = xmlData.createElement("employee");
    newEmp.innerHTML = `
        <id>${empId.value}</id>
        <name>${empName.value}</name>
        <department>${empDept.value}</department>
        <salary>${empSalary.value}</salary>
    `;
    employeesNode.appendChild(newEmp);
    displayEmployees();
    showMessage("Employee added (UI only)", false);
}

function updateEmployee() {
    const employees = xmlData.getElementsByTagName("employee");
    for (let emp of employees) {
        if (emp.getElementsByTagName("id")[0].textContent === empId.value) {
            emp.getElementsByTagName("department")[0].textContent = empDept.value;
            emp.getElementsByTagName("salary")[0].textContent = empSalary.value;
            displayEmployees();
            showMessage("Employee updated", false);
            return;
        }
    }
    showMessage("Employee not found", true);
}

function deleteEmployee() {
    const employees = xmlData.getElementsByTagName("employee");
    for (let emp of employees) {
        if (emp.getElementsByTagName("id")[0].textContent === empId.value) {
            emp.parentNode.removeChild(emp);
            displayEmployees();
            showMessage("Employee deleted (UI only)", false);
            return;
        }
    }
    showMessage("Employee not found", true);
}

function showMessage(msg, isError) {
    const message = document.getElementById("message");
    message.textContent = msg;
    message.style.color = isError ? "red" : "green";
}

window.onload = loadEmployees;
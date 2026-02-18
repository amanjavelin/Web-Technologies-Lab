let xmlDoc = null;

function loadBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            xmlDoc = xhr.responseXML;
            if (!xmlDoc) {
                showMessage("Malformed XML file!", true);
                return;
            }
            displayBooks();
            showMessage("Books loaded successfully.", false);
        } else {
            showMessage("Error loading XML file.", true);
        }
    };
    xhr.send();
}

function displayBooks() {
    const table = document.getElementById("bookTable");
    table.innerHTML = "";
    const books = xmlDoc.getElementsByTagName("book");
    if (books.length === 0) {
        showMessage("No books available.", true);
        return;
    }
    for (let book of books) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.getElementsByTagName("id")[0].textContent}</td>
            <td>${book.getElementsByTagName("title")[0].textContent}</td>
            <td>${book.getElementsByTagName("author")[0].textContent}</td>
            <td>${book.getElementsByTagName("status")[0].textContent}</td>
        `;
        table.appendChild(row);
    }
}

function validateInputs(requireAll = true) {
    if (!bookId.value) {
        showMessage("Book ID is required.", true);
        return false;
    }
    if (requireAll && (!bookTitle.value || !bookAuthor.value || !bookStatus.value)) {
        showMessage("All fields must be filled.", true);
        return false;
    }
    return true;
}

function addBook() {
    if (!validateInputs()) return;
    const books = xmlDoc.getElementsByTagName("book");
    for (let book of books) {
        if (book.getElementsByTagName("id")[0].textContent === bookId.value) {
            showMessage("Book ID already exists!", true);
            return;
        }
    }
    const library = xmlDoc.getElementsByTagName("library")[0];
    const newBook = xmlDoc.createElement("book");

    newBook.innerHTML = `
        <id>${bookId.value}</id>
        <title>${bookTitle.value}</title>
        <author>${bookAuthor.value}</author>
        <status>${bookStatus.value}</status>
    `;

    library.appendChild(newBook);
    displayBooks();
    showMessage("Book added successfully.", false);
}

function updateBook() {
    if (!validateInputs(false)) return;
    const books = xmlDoc.getElementsByTagName("book");
    for (let book of books) {
        if (book.getElementsByTagName("id")[0].textContent === bookId.value) {
            book.getElementsByTagName("status")[0].textContent = bookStatus.value;
            displayBooks();
            showMessage("Book status updated.", false);
            return;
        }
    }
    showMessage("Book not found.", true);
}

function deleteBook() {
    if (!validateInputs(false)) return;
    const books = xmlDoc.getElementsByTagName("book");
    for (let book of books) {
        if (book.getElementsByTagName("id")[0].textContent === bookId.value) {
            book.parentNode.removeChild(book);
            displayBooks();
            showMessage("Book deleted successfully.", false);
            return;
        }
    }
    showMessage("Book not found.", true);
}

function showMessage(msg, isError) {
    const message = document.getElementById("message");
    message.textContent = msg;
    message.style.color = isError ? "red" : "green";
}

window.onload = loadBooks;
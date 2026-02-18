let products = [];

async function loadProducts() {
    try {
        const response = await fetch("inventory.json");
        if (!response.ok) throw new Error("Failed to load JSON");
        products = await response.json();
        displayProducts();
        showMessage("Inventory loaded successfully.", false);

    } catch (error) {
        showMessage("Error: " + error.message, true);
    }
}

function displayProducts(filtered = null) {
    const table = document.getElementById("inventoryTable");
    table.innerHTML = "";
    const data = filtered || products;
    let total = 0;
    data.forEach(prod => {
        const row = document.createElement("tr");
        if (prod.stock < 5) {
            row.classList.add("low-stock");
        }
        row.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.name}</td>
            <td>${prod.category}</td>
            <td>₹ ${prod.price}</td>
            <td>${prod.stock}</td>
        `;
        total += prod.price * prod.stock;
        table.appendChild(row);
    });
    document.getElementById("totalValue").textContent = total;
}

function validateInputs(requireAll = true) {
    if (!prodId.value) {
        showMessage("Product ID required.", true);
        return false;
    }
    if (requireAll && (!prodName.value || !prodCategory.value || !prodPrice.value || !prodStock.value)) {
        showMessage("All fields required.", true);
        return false;
    }
    if (prodPrice.value < 0 || prodStock.value < 0) {
        showMessage("Price and Stock cannot be negative.", true);
        return false;
    }
    return true;
}

function addProduct() {
    if (!validateInputs()) return;
    if (products.some(p => p.id === prodId.value)) {
        showMessage("Product ID already exists.", true);
        return;
    }
    products.push({
        id: prodId.value,
        name: prodName.value,
        category: prodCategory.value,
        price: Number(prodPrice.value),
        stock: Number(prodStock.value)
    });
    displayProducts();
    showMessage("Product added.", false);
}

function updateProduct() {
    if (!validateInputs(false)) return;
    const product = products.find(p => p.id === prodId.value);
    if (!product) {
        showMessage("Product not found.", true);
        return;
    }
    if (prodPrice.value) product.price = Number(prodPrice.value);
    if (prodStock.value) product.stock = Number(prodStock.value);
    displayProducts();
    showMessage("Product updated.", false);
}

function deleteProduct() {
    const index = products.findIndex(p => p.id === prodId.value);
    if (index === -1) {
        showMessage("Product not found.", true);
        return;
    }
    products.splice(index, 1);
    displayProducts();
    showMessage("Product deleted.", false);
}

function searchByCategory() {
    const category = searchCategory.value.trim().toLowerCase();
    if (!category) {
        showMessage("Enter category to search.", true);
        return;
    }
    const filtered = products.filter(p =>
        p.category.toLowerCase() === category
    );
    if (filtered.length === 0) {
        showMessage("No products found in this category.", true);
    }
    displayProducts(filtered);
}

function showMessage(msg, isError) {
    const message = document.getElementById("message");
    message.textContent = msg;
    message.style.color = isError ? "red" : "green";
}

window.onload = loadProducts;
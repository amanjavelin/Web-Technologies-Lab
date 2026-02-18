const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

let debounceTimer;

searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
        resultsDiv.innerHTML = "";
        return;
    }
    debounceTimer = setTimeout(() => {
        searchProducts(query);
    }, 500); 
});

function searchProducts(query) {
    resultsDiv.innerHTML = `<p class="loading">Searching...</p>`
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                const filtered = data.products.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
                displayResults(filtered);
            }, 500); 
        })
        .catch(() => {
            resultsDiv.innerHTML = `<p class="error">Failed to fetch products</p>`;
        });
}

function displayResults(products) {
    resultsDiv.innerHTML = "";
    if (products.length === 0) {
        resultsDiv.innerHTML = `<p class="no-results">No results found</p>`;
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");

        productCard.innerHTML = `
            <h4>${product.name}</h4>
            <p>Price: ₹ ${product.price}</p>
            <p>Category: ${product.category}</p>
        `;
        resultsDiv.appendChild(productCard);
    });
}
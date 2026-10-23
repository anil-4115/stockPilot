
const productForm = document.getElementById("product-form");
const formMessage = document.getElementById("form-message");
const inventoryBody = document.getElementById("inventory-body");
const searchInput = document.getElementById("search-input");
const refreshButton = document.getElementById("refresh-button");

let products = [];

function showMessage(message, type, errors = []) {
    formMessage.replaceChildren();
    formMessage.className = `message ${type}`;

    const heading = document.createElement("strong");
    heading.textContent = message;
    formMessage.appendChild(heading);

    if (errors.length > 0) {
        const list = document.createElement("ul");

        errors.forEach(error => {
            const item = document.createElement("li");
            item.textContent = error;
            list.appendChild(item);
        });

        formMessage.appendChild(list);
    }
}

function hideMessage() {
    formMessage.className = "message hidden";
    formMessage.replaceChildren();
}

function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
}

function getStatusClass(status) {
    switch (status) {
        case "In stock":
            return "in-stock";
        case "Low stock":
            return "low-stock";
        case "Out of stock":
            return "out-of-stock";
        case "Expired":
            return "expired";
        default:
            return "";
    }
}

function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
    );

    inventoryBody.replaceChildren();

    if (filteredProducts.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent = products.length === 0
            ? "No products yet. Add your first product."
            : "No products match your search.";

        row.appendChild(cell);
        inventoryBody.appendChild(row);
    } else {
        filteredProducts.forEach(product => {
            const row = document.createElement("tr");

            const productCell = document.createElement("td");
            const name = document.createElement("span");
            const sku = document.createElement("span");

            name.className = "product-name";
            name.textContent = product.name;

            sku.className = "product-sku";
            sku.textContent = product.sku;

            productCell.append(name, sku);

            const priceCell = createCell(
                `₹${Number(product.price).toFixed(2)}`
            );

            const quantityCell = createCell(String(product.quantity));

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className =
                `status ${getStatusClass(product.status)}`;
            statusBadge.textContent = product.status;

            statusCell.appendChild(statusBadge);

            // Delete button
            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";
            deleteButton.setAttribute(
                "aria-label",
                `Delete ${product.name}`
            );

            deleteButton.addEventListener("click", () => {
                deleteProduct(product, deleteButton);
            });

            actionCell.appendChild(deleteButton);

            row.append(
                productCell,
                priceCell,
                quantityCell,
                statusCell,
                actionCell
            );

            inventoryBody.appendChild(row);
        });
    }

    document.getElementById("inventory-count").textContent =
        `${products.length} ${products.length === 1 ? "item" : "items"}`;

    document.getElementById("inventory-summary").textContent =
        `Showing ${filteredProducts.length} of ${products.length} products`;
}

function updateDashboard() {
    const totalUnits = products.reduce(
        (total, product) => total + Number(product.quantity),
        0
    );

    const lowStockCount = products.filter(product =>
        product.status === "Low stock" ||
        product.status === "Out of stock"
    ).length;

    const expiredCount = products.filter(
        product => product.status === "Expired"
    ).length;

    document.getElementById("total-products").textContent =
        products.length;

    document.getElementById("total-units").textContent =
        totalUnits;

    document.getElementById("low-stock").textContent =
        lowStockCount;

    document.getElementById("expired-products").textContent =
        expiredCount;
}

async function loadProducts() {
    refreshButton.disabled = true;

    try {
        const response = await fetch("/api/products", {
            cache: "no-store"
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Could not load inventory.");
        }

        products = data.products;
        updateDashboard();
        renderProducts();
    } catch (error) {
        showMessage(
            error.message || "Unable to connect to the server.",
            "error"
        );
    } finally {
        refreshButton.disabled = false;
    }
}

// Delete a product from GitHub-backed storage
async function deleteProduct(product, button) {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${product.name}" (SKU: ${product.sku})?`
    );

    if (!confirmed) return;

    hideMessage();
    button.disabled = true;
    button.textContent = "Deleting...";

    try {
        const response = await fetch(
            `/api/products/${encodeURIComponent(product.id)}`,
            {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Could not delete product.");
        }

        showMessage(data.message || "Product deleted successfully!", "success");
        await loadProducts();
    } catch (error) {
        showMessage(
            error.message || "Unable to delete the product. Please try again.",
            "error"
        );

        button.disabled = false;
        button.textContent = "Delete";
    }
}

productForm.addEventListener("submit", async event => {
    event.preventDefault();
    hideMessage();

    const submitButton = productForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    submitButton.textContent = "Adding product...";

    const formData = new FormData(productForm);
    const productData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            showMessage(
                data.message || "Product could not be added.",
                "error",
                data.errors || []
            );
            return;
        }

        showMessage(data.message, "success");

        productForm.reset();
        document.getElementById("reorderLevel").value = 5;

        await loadProducts();
    } catch (error) {
        showMessage(
            "Could not connect to the server. Please try again.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = "<span>＋</span> Add to inventory";
    }
});

searchInput.addEventListener("input", renderProducts);
refreshButton.addEventListener("click", loadProducts);

// Load initial inventory
loadProducts();

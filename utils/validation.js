
function validateProduct(data) {
    const errors = [];

    const name = typeof data.name === "string"
        ? data.name.trim()
        : "";

    const sku = typeof data.sku === "string"
        ? data.sku.trim()
        : "";

    const category = typeof data.category === "string"
        ? data.category.trim()
        : "";

    // Required field validation
    if (!name) {
        errors.push("Product name is required.");
    }

    if (!sku) {
        errors.push("SKU is required.");
    }

    if (!category) {
        errors.push("Category is required.");
    }

    // Numeric validation
    const price = data.price;
    const quantity = data.quantity;
    const reorderLevel = data.reorderLevel;

    if (
        price === undefined ||
        price === null ||
        String(price).trim() === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        errors.push("Price must be a valid non-negative number.");
    }

    if (
        quantity === undefined ||
        quantity === null ||
        String(quantity).trim() === "" ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) < 0
    ) {
        errors.push("Quantity must be a non-negative integer.");
    }

    if (
        reorderLevel === undefined ||
        reorderLevel === null ||
        String(reorderLevel).trim() === "" ||
        !Number.isInteger(Number(reorderLevel)) ||
        Number(reorderLevel) < 0
    ) {
        errors.push("Reorder level must be a non-negative integer.");
    }

    // Optional expiry date validation
    let expiryDate = null;

    if (data.expiryDate !== undefined &&
        data.expiryDate !== null &&
        String(data.expiryDate).trim() !== "") {

        const value = String(data.expiryDate).trim();
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

        if (!match) {
            errors.push("Expiry date must use YYYY-MM-DD format.");
        } else {
            const year = Number(match[1]);
            const month = Number(match[2]);
            const day = Number(match[3]);
            const date = new Date(Date.UTC(year, month - 1, day));

            const isValidDate =
                date.getUTCFullYear() === year &&
                date.getUTCMonth() === month - 1 &&
                date.getUTCDate() === day;

            if (!isValidDate) {
                errors.push("Please enter a valid expiry date.");
            } else {
                expiryDate = value;
            }
        }
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    return {
        valid: true,
        errors: [],
        product: {
            name,
            sku,
            category,
            price: Number(price),
            quantity: Number(quantity),
            reorderLevel: Number(reorderLevel),
            expiryDate
        }
    };
}

module.exports = { validateProduct };

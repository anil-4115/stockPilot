
const express = require("express");
const fs = require("fs");
const path = require("path");
const { validateProduct } = require("../utils/validation");

const router = express.Router();

// Persistent storage location
const dataDirectory = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDirectory, "products.json");

// Ensure the data folder and file exist
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]", "utf8");
}

// Read products from JSON file
function loadProducts() {
    try {
        const data = fs.readFileSync(dataFile, "utf8");
        const products = JSON.parse(data);

        if (!Array.isArray(products)) {
            throw new Error("Products data must be a JSON array.");
        }

        return products;
    } catch (error) {
        console.error("Failed to load products:", error.message);
        throw error;
    }
}

// Save products to JSON file
function saveProducts(products) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(products, null, 2),
        "utf8"
    );
}

// Load the existing inventory
let products = loadProducts();

// Continue IDs from the largest existing ID
let nextId =
    products.reduce((maxId, product) => Math.max(maxId, product.id || 0), 0) + 1;

// Calculate inventory status
function getStatus(product) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (product.expiryDate) {
        const expiry = new Date(`${product.expiryDate}T00:00:00Z`);

        if (expiry < today) {
            return "Expired";
        }
    }

    if (product.quantity === 0) {
        return "Out of stock";
    }

    if (product.quantity <= product.reorderLevel) {
        return "Low stock";
    }

    return "In stock";
}

// GET: Retrieve all products
router.get("/", (req, res) => {
    const result = products.map(product => ({
        ...product,
        status: getStatus(product)
    }));

    return res.status(200).json({
        success: true,
        count: result.length,
        products: result
    });
});

// POST: Add a product
router.post("/", (req, res) => {
    const validation = validateProduct(req.body);

    // Reject invalid input
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: "Please correct the following errors.",
            errors: validation.errors
        });
    }

    const productData = validation.product;

    // Reject duplicate SKU (case-insensitive)
    const duplicate = products.some(
        product =>
            product.sku.toLowerCase() === productData.sku.toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            success: false,
            message: "A product with this SKU already exists."
        });
    }

    const newProduct = {
        id: nextId,
        ...productData,
        createdAt: new Date().toISOString()
    };

    // Save before updating in-memory inventory
    try {
        const updatedProducts = [...products, newProduct];
        saveProducts(updatedProducts);

        products = updatedProducts;
        nextId++;

        return res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: {
                ...newProduct,
                status: getStatus(newProduct)
            }
        });
    } catch (error) {
        console.error("Failed to save product:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to save the product. Please try again."
        });
    }
});

module.exports = router;

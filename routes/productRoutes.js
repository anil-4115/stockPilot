
const express = require("express");
const { validateProduct } = require("../utils/validation");

const router = express.Router();

const GITHUB_API = "https://api.github.com";
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const TOKEN = process.env.GITHUB_TOKEN;
const FILE_PATH = "data/products.json";
const BRANCH = "main";

// Check GitHub configuration
function checkConfig() {
    if (!OWNER || !REPO || !TOKEN) {
        throw new Error("GitHub environment variables are missing.");
    }
}

// Read the inventory file from GitHub
async function loadProducts() {
    checkConfig();

    const response = await fetch(
        `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            cache: "no-store"
        }
    );

    if (!response.ok) {
        throw new Error(`GitHub read failed: ${response.status}`);
    }

    const file = await response.json();
    const content = Buffer.from(file.content, "base64").toString("utf8");
    const products = JSON.parse(content);

    if (!Array.isArray(products)) {
        throw new Error("products.json must contain a JSON array.");
    }

    return { products, sha: file.sha };
}

// Save inventory changes to GitHub
async function saveProducts(products, sha, message) {
    checkConfig();

    const content = Buffer.from(
        JSON.stringify(products, null, 2),
        "utf8"
    ).toString("base64");

    const response = await fetch(
        `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                content,
                sha,
                branch: BRANCH
            })
        }
    );

    if (!response.ok) {
        const details = await response.text();
        console.error("GitHub write failed:", response.status, details);

        throw new Error(`GitHub write failed: ${response.status}`);
    }
}

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

// GET: Retrieve all products from GitHub
router.get("/", async (req, res) => {
    try {
        const { products } = await loadProducts();

        const result = products.map(product => ({
            ...product,
            status: getStatus(product)
        }));

        return res.status(200).json({
            success: true,
            count: result.length,
            products: result
        });
    } catch (error) {
        console.error("Failed to load products:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load products from storage."
        });
    }
});

// POST: Validate and add a product
router.post("/", async (req, res) => {
    const validation = validateProduct(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: "Please correct the following errors.",
            errors: validation.errors
        });
    }

    try {
        // Always read the latest committed inventory
        const { products, sha } = await loadProducts();
        const productData = validation.product;

        // Reject duplicate SKU (case-insensitive)
        const duplicate = products.some(
            product =>
                product.sku.toLowerCase() ===
                productData.sku.toLowerCase()
        );

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "A product with this SKU already exists."
            });
        }

        const nextId =
            products.reduce(
                (maxId, product) =>
                    Math.max(maxId, Number(product.id) || 0),
                0
            ) + 1;

        const newProduct = {
            id: nextId,
            ...productData,
            createdAt: new Date().toISOString()
        };

        const updatedProducts = [...products, newProduct];

        await saveProducts(
            updatedProducts,
            sha,
            `Add product ${newProduct.sku}`
        );

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

 // DELETE: Remove a product by ID
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID."
        });
    }

    try {
        // Read the latest inventory from GitHub
        const { products, sha } = await loadProducts();

        const product = products.find(item => Number(item.id) === id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        const updatedProducts = products.filter(
            item => Number(item.id) !== id
        );

        // Save the updated inventory to GitHub
        await saveProducts(
            updatedProducts,
            sha,
            `Delete product ${product.sku}`
        );

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully!",
            productId: id
        });
    } catch (error) {
        console.error("Failed to delete product:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete the product. Please try again."
        });
    }
});

module.exports = router;

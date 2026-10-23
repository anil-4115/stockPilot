# 📦 StockPilot — Smart Inventory & Expiry Management System

**A web-based inventory management application for tracking products, monitoring stock levels, and identifying expired or low-stock items.**

<p align="center">
  <strong>Built with Node.js, Express.js, HTML, CSS, JavaScript, and GitHub API</strong>
</p>

---

## 🌐 Live Demo

- **Live Application:** [StockPilot on Vercel](https://stockpilot-anil-add5.vercel.app)
- **GitHub Repository:** [anil-4115/stockPilot](https://github.com/anil-4115/stockPilot)

---

## 📖 Project Overview

StockPilot is a Smart Inventory & Expiry Management System designed to simplify product inventory tracking through a clean and user-friendly web interface.

The application allows users to add products, view inventory records, search products, monitor stock quantities, and identify products that are expired or require restocking.

The project demonstrates server-side development using Node.js and Express.js, REST API development, input validation, HTTP request handling, and integration with the GitHub API for persistent JSON-based data storage.

Unlike a traditional setup that requires a database server, StockPilot stores inventory records in a JSON file within its GitHub repository. The deployed application uses the GitHub API to retrieve and update that file.

## 🎯 Project Objectives

- Develop a web application using Node.js and Express.js.
- Implement server-side validation for product information.
- Handle HTTP GET, POST, and DELETE requests.
- Provide clear success and error messages.
- Track inventory quantities and stock conditions.
- Identify expired and low-stock products.
- Store inventory data persistently using a GitHub-hosted JSON file.
- Deploy the application online using Vercel.
- Demonstrate a practical server-side development workflow.

## ✨ Features

### 1. Inventory Dashboard

- View the total number of products.
- Monitor the total units available across the inventory.
- Track low-stock and out-of-stock products.
- Identify expired products.
- View updated inventory information after changes.

### 2. Product Management

- Add products to the inventory.
- Display product names, SKUs, prices, and quantities.
- Delete products from the inventory.
- Refresh the inventory to retrieve the latest data.
- Prevent duplicate SKUs using case-insensitive comparison.

### 3. Stock Status Monitoring

StockPilot calculates product status based on its expiry date, quantity, and reorder level.

| Status | Condition |
|---|---|
| Expired | The product's expiry date has passed. |
| Out of stock | The product quantity is zero. |
| Low stock | Quantity is greater than zero but less than or equal to the reorder level. |
| In stock | Quantity is greater than the reorder level and the product is not expired. |

**Priority:** Expired status takes precedence over the other stock conditions.

### 4. Search Functionality

Search the inventory by product name or SKU to locate products quickly.

### 5. Server-Side Validation

Product information is validated on the server before it is saved. Invalid input is rejected, and meaningful error messages are returned to the frontend.

Validation helps prevent incorrect inventory records and duplicate product entries.

### 6. Persistent GitHub Storage

Inventory data is stored in:

`data/products.json`

The deployed application uses the GitHub API to read and update this file. Successful changes are committed to the repository, allowing inventory data to persist across website refreshes and deployments.

**Important:** GitHub is being used as a lightweight storage mechanism for this project, not as a traditional database. Repository write access must be protected with a private access token.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structures the application interface. |
| CSS3 | Provides styling, layout, and responsive presentation. |
| JavaScript | Implements frontend interactions and API communication. |
| Node.js | Runs the server-side JavaScript application. |
| Express.js | Handles HTTP requests and API routes. |
| GitHub REST API | Reads and updates the JSON inventory file. |
| JSON | Stores product records in a structured format. |
| Vercel | Hosts the deployed application. |
| Git and GitHub | Manage source code and version history. |
| Nodemon | Automatically restarts the local development server during development. |

---

## 🏗️ System Architecture

StockPilot uses a frontend, an Express server/API layer, and GitHub-hosted JSON storage.

```text
                  USER
                    |
                    v
          +--------------------+
          | StockPilot Frontend|
          | HTML, CSS, JS      |
          +--------------------+
                    |
                    | HTTP Requests
                    v
          +--------------------+
          | Node.js + Express  |
          | REST API           |
          +--------------------+
                    |
                    v
          +--------------------+
          | Server Validation  |
          | Product Operations |
          +--------------------+
                    |
                    | GitHub REST API
                    v
          +--------------------+
          | GitHub Repository  |
          | data/products.json |
          +--------------------+
```

### Application Workflow

1. The user opens the StockPilot website.
2. The frontend requests the inventory from the products API.
3. The server retrieves product records from the GitHub-hosted JSON file.
4. The server calculates each product's current stock status.
5. The frontend displays the products and dashboard statistics.
6. When a product is added or deleted, the server validates the operation and updates the JSON file through the GitHub API.
7. The updated inventory is retrieved and displayed in the application.

---

## 📁 Project Structure

```text
StockPilot/
│
├── data/
│   └── products.json
│
├── public/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── favicon.png
│
├── routes/
│   └── productRoutes.js
│
├── utils/
│   └── validation.js
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env
└── README.md
```

**File descriptions:**

- `server.js` — Configures Express, middleware, static frontend files, the health-check route, and product routes.
- `routes/productRoutes.js` — Implements inventory API operations, GitHub-backed storage, and stock-status calculation.
- `utils/validation.js` — Validates incoming product information.
- `public/index.html` — Defines the dashboard and product-entry interface.
- `public/style.css` — Contains the application's styling.
- `public/app.js` — Handles form submission, API calls, search, dashboard updates, and inventory rendering.
- `data/products.json` — Holds the JSON inventory data in the repository.
- `.env` — Stores local environment variables and the GitHub token. This file must not be committed.
- `.gitignore` — Excludes dependencies, environment secrets, and unnecessary local files.
- `package.json` — Defines dependencies and development scripts.

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [Git](https://git-scm.com/)
- A GitHub account

### Step 1: Clone the repository

```bash
git clone https://github.com/anil-4115/stockPilot.git
cd stockPilot
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment variables

Create a `.env` file in the project root:

```env
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=anil-4115
GITHUB_REPO=stockPilot
```

Replace `your_github_token` with your GitHub personal access token.

The token must have the necessary access to read and update the selected repository's contents.

**Security requirements:**

- Never commit `.env` to GitHub.
- Never expose the token in frontend JavaScript or HTML.
- Never share the token publicly.
- Configure the same required variables in Vercel's project environment settings.

### Step 4: Start the development server

```bash
npm run dev
```

Alternatively:

```bash
npm start
```

### Step 5: Open the application

Visit:

`http://localhost:3000`

The server's health endpoint can be tested at:

`http://localhost:3000/api/health`

---

## 🔌 API Endpoints

The application uses REST-style endpoints for communication between the frontend and backend.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Checks whether the server is running. |
| GET | `/api/products` | Retrieves the inventory. |
| POST | `/api/products` | Validates and adds a product. |
| DELETE | `/api/products/:id` | Deletes a product by its ID, if implemented in the deployed backend. |

### GET — Retrieve Products

Request:

```http
GET /api/products
```

Example response:

```json
{
  "success": true,
  "count": 1,
  "products": [
    {
      "id": 1,
      "name": "Sample Product",
      "sku": "SP101",
      "price": 100,
      "quantity": 20,
      "status": "In stock"
    }
  ]
}
```

The example is illustrative; actual response fields depend on the implementation.

### POST — Add a Product

Request:

```http
POST /api/products
Content-Type: application/json
```

Example request body:

```json
{
  "name": "Sample Product",
  "sku": "SP101",
  "price": 100,
  "quantity": 20,
  "reorderLevel": 5,
  "expiryDate": "2027-12-31"
}
```

A successful request returns a success message and the newly created product. Invalid input returns a validation error, and duplicate SKUs are rejected.

### DELETE — Remove a Product

Request:

```http
DELETE /api/products/1
```

This operation removes the product with the specified ID if the delete endpoint is implemented and enabled in the deployed version.

---

## 🧪 Testing

The application should be tested with both valid and invalid input.

| Test case | Expected result |
|---|---|
| Add a valid product | Product is saved and displayed. |
| Submit missing required fields | Validation error is displayed. |
| Enter an invalid price or quantity | Invalid input is rejected. |
| Add an existing SKU again | Duplicate SKU is rejected. |
| Retrieve products | Current inventory is returned. |
| Delete an existing product | Product is removed from inventory. |
| Refresh the dashboard | Latest saved inventory is displayed. |
| Check an expired product | Status is displayed as Expired. |
| Check a zero-quantity product | Status is displayed as Out of stock. |
| Check a product below its reorder level | Status is displayed as Low stock. |

For API testing, use the browser for GET requests or a tool such as [Postman](https://www.postman.com/) for GET, POST, and DELETE requests.

---

## 🚀 Deployment

StockPilot is deployed using Vercel and GitHub.

### Deployment process

1. Push the source code to the GitHub repository.
2. Import or connect the repository to Vercel.
3. Configure the required environment variables in Vercel.
4. Deploy the application.
5. Test the live application and its API endpoints.

### Live application

[https://stockpilot-anil-add5.vercel.app](https://stockpilot-anil-add5.vercel.app)

### Important deployment considerations

- Vercel's serverless filesystem is not suitable for persistent JSON file writes.
- GitHub API storage allows the application to update the repository file without relying on a writable local filesystem.
- Keep the GitHub token exclusively on the server side.
- Protect write operations with authentication, authorization, and appropriate request limits before using the application with sensitive or production inventory.
- Concurrent writes can overwrite one another if the GitHub file's latest version is not checked. A robust implementation should use the file's current SHA and handle GitHub API conflicts.
- GitHub API rate limits and repository commits make this approach better suited to a small demonstration project than a high-traffic production inventory system.

---

## 🔐 Security

StockPilot uses environment variables to keep the GitHub access token outside the source code.

Recommended security practices:

- Keep `.env` in `.gitignore`.
- Store deployment credentials in Vercel environment variables.
- Use a fine-grained token restricted to the StockPilot repository.
- Grant only the permissions required to access repository contents.
- Never send the GitHub token to the browser.
- Add authentication before allowing unrestricted inventory changes.
- Validate all incoming data on the server.
- Handle API failures without exposing secrets or internal error details.

---

## ⚠️ Current Limitations

- Inventory storage depends on the availability of the GitHub API.
- Each successful data update may create a repository commit.
- GitHub rate limits can restrict frequent operations.
- Simultaneous updates require conflict handling to prevent lost changes.
- A database-backed architecture would be more suitable for a large inventory or multiple concurrent users.
- Product editing and authentication should be considered future enhancements unless already implemented.

---

## 🔮 Future Enhancements

Potential improvements include:

- Edit existing product details.
- Add user authentication and role-based access control.
- Implement product categories and supplier management.
- Add advanced filtering and sorting.
- Provide downloadable inventory reports.
- Add low-stock and expiry notifications.
- Display inventory trends using charts.
- Introduce audit logs for product changes.
- Migrate storage to a dedicated database when scalability requirements increase.

---

## 🎓 Academic Relevance

**Practical No. 04 — Server-Side Development Using Node.js**

This project demonstrates:

- Node.js server development.
- Express.js routing and middleware.
- HTTP GET, POST, and DELETE request handling.
- Server-side input validation.
- REST API communication.
- JSON-based data representation and persistence through the GitHub API.
- Error handling and user feedback.
- Deployment and environment-variable configuration.

---

## 👨‍💻 Author

**Anil Verma**  
Third-Year Software Engineering Student

GitHub: [anil-4115](https://github.com/anil-4115)

---

## 📄 License

This project was developed for educational and practical learning purposes. If you plan to distribute or reuse the code publicly, consider adding an appropriate open-source license.

---

**StockPilot — Smarter Inventory. Better Control.**

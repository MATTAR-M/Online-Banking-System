<<<<<<< HEAD
<<<<<<< HEAD
# 🏦 Online Banking System API

A robust, secure, and fully functional Backend API for an Online Banking System. Built with Node.js, Express, and MongoDB, this project simulates real-world banking operations including deposits, withdrawals, secure transfers, and detailed account statements.

## ✨ Features

- **Role-Based Access Control (RBAC):** Secure routes with JWT authentication separating `User` and `Admin` privileges.
- **Financial Transactions:** Seamlessly handle deposits, withdrawals, and account-to-account transfers.
- **Database Atomicity:** Utilizes MongoDB Sessions/Transactions to ensure secure money transfers (ACID properties).
- **Security First:** - Input validation using **Joi**.
  - Password hashing using **bcrypt**.
  - API endpoint protection using **express-rate-limit** to prevent Brute-Force and DDoS attacks.
- **Account Management:** Admins can easily freeze (deactivate) or activate bank accounts.
- **Financial Reporting:** Generate detailed account statements filtered by date ranges.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Security:** express-rate-limit

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/MATTAR-M/Online-Banking-System.git](https://github.com/MATTAR-M/Online-Banking-System.git)
   cd Online-Banking-System

2. **Install dependencies:**
   ```bash
   npm install

3. **Set up Environment Variables:**
   Create a .env file in the root directory and add the following variables:
   PORT=Port number
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key

4. **Start the server:**
   ```bash
   npm run dev

📡 API Endpoints Overview
Users & Authentication
POST /auth/register - Register a new user

POST /auth/login - Login and get JWT token

Bank Accounts
POST /bank-accounts - Create a new bank account (User)

PATCH /bank-accounts/status - Freeze/Unfreeze an account (Admin only)

Transactions
POST /transactions/deposit - Deposit money into account

POST /transactions/withdraw - Withdraw money (checks balance first)

POST /transactions/transfer - Transfer money to another account (Atomic Transaction)

GET /transactions/statement - Get account statement (with fromDate and toDate query filters)

📁 Folder Structure
The project follows a clean, Layered Architecture pattern:

/src/models - Mongoose Database Schemas.

/src/controllers - Core business logic and operations.

/src/routers - API route definitions.

/src/validations - Joi schema validations.

/src/middleware - Auth, Error handling, and Rate Limiting.

/src/services - Reusable database queries.

🤝 Contributing
Contributions, issues, and feature requests are welcome!
📝 License
This project is open-source and available under the MIT License.
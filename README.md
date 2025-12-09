# Hugly Portal

Hugly Portal is a **backend authentication application** built with **Next.js (App Router)** and **Prisma 7**. It implements a secure authentication system (register, login, me), user management, and audit logging. The project emphasizes **reproducibility, maintainability, and best practices**, making it suitable for both local development and production deployment.

---

## 📖 Project Overview

- **Framework:** Next.js (React‑based, App Router)
- **Database ORM:** Prisma 7 with PostgreSQL
- **Authentication:** JWT (access + refresh tokens) stored in httpOnly cookies
- **Security:** Password hashing with `scrypt`, audit logs for sensitive actions
- **Deployment:** Compatible with Prisma Data Proxy for runtime queries
- **Architecture:** Server components for data access, client components for interactivity

---

## 🛠 Prerequisites

Before running Hugly Portal locally, ensure you have:

- **Node.js** v18 or later  
- **npm** or **yarn** package manager  
- **PostgreSQL** installed locally or accessible via Docker/cloud  
- **Git** for version control  
- **Prisma CLI** (installed via npm)  

Optional tools:
- **Docker** (recommended for local Postgres setup)  
- **pgAdmin** or another Postgres GUI for database management  

---


Steps to Run Locally
Clone the repository

bash
git clone https://github.com/your-org/hugly-portal.git
cd hugly-portal
Install dependencies

bash
npm install
Set up the database

Ensure Postgres is running locally or via Docker.

Create the database:

bash
createdb hugly_portal
Generate Prisma client

bash
npx prisma generate
Run migrations

bash
npx prisma migrate dev --name init
Start the development server

bash
npm run dev
Open the app Visit http://localhost:3000 in your browser.




## ⚙️ Environment Variables

Create a `.env` file in the project root with the following:

```env
NODE_ENV=development

# Runtime connection (Prisma Data Proxy)
DATABASE_URL="postgres://<proxy-user>:<proxy-password>@db.prisma.io:5432/postgres?sslmode=require"

# Direct connection for migrations (local or cloud Postgres)
DIRECT_URL="postgresql://postgres@localhost:5432/hugly_portal?schema=public"

# JWT secrets
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Cookie domain
COOKIE_DOMAIN=localhost



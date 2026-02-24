# ☕ Digital Café — Full-Stack Digital Menu Platform

A premium, mobile-first digital café menu platform inspired by Starbucks / Blue Tokai.

## Architecture

```
Digital-Menu-Card/
├── client/     # Customer app (React + Vite + TypeScript)
├── admin/      # Admin panel (React + Vite + TypeScript)
├── server/     # Backend API (Node.js + Express + MongoDB)
└── .env.example
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

---

## Quick Start

### 1. Backend (server/)

```bash
cd server
cp ../.env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

The API server starts at **http://localhost:5000**.

On first start, the admin user is automatically created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

**Seed menu items:**
```bash
npm run seed
```

### 2. Customer App (client/)

```bash
cd client
npm install
npm run dev
```

Customer app runs at **http://localhost:5173**.

### 3. Admin Panel (admin/)

```bash
cd admin
npm install
npm run dev
```

Admin panel runs at **http://localhost:5174**.

---

## Default Credentials

### Admin Panel (`http://localhost:5174`)

| Field | Value |
|---|---|
| **Email** | `admin@digitalcafe.com` |
| **Password** | `Admin@123` |

> These are the default values set in `.env.example`. The admin account is created automatically when the backend server starts for the first time. You can change them by editing `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` before the first run.

---

## Environment Variables

Copy `.env.example` to `server/.env` and fill in the values:

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/digital-cafe` |
| `JWT_SECRET` | JWT signing secret | *(required)* |
| `PORT` | API server port | `5000` |
| `ADMIN_EMAIL` | Admin user email | `admin@digitalcafe.com` |
| `ADMIN_PASSWORD` | Admin user password | `Admin@123` |

---

## Features

### Customer App
- 🏠 **Home** — Hero section, featured items, about snippet
- 📋 **Menu** — Full menu with search & category/type filters (Veg/Non-Veg/Beverages/etc.)
- 🛒 **Cart** — Add/remove items, qty controls, coupon codes
- 💳 **Checkout** — Delivery address, COD or UPI payment
- ✅ **Payment Success** — Animated confirmation page
- 📦 **Order Tracking** — Live status: Placed → Preparing → Out for Delivery → Delivered
- 📜 **Orders** — Full order history
- ℹ️ **About** — Café story and values
- 📞 **Contact** — Contact form

**Coupon codes:** `WELCOME50` (50% off), `CAFE10` (10% off)

### Admin Panel
- 📊 **Dashboard** — Revenue, order count, today's orders, menu item count
- 🍽️ **Menu Management** — Add, edit, delete, toggle availability of menu items
- 📦 **Order Management** — View all orders, update status, filter by status
- 📈 **Analytics** — Daily revenue bar chart, order count line chart (last 30 days)

### Backend API
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/menu` — Get all available menu items (public)
- `POST /api/menu` — Add menu item (admin)
- `PUT /api/menu/:id` — Update menu item (admin)
- `DELETE /api/menu/:id` — Delete menu item (admin)
- `POST /api/orders` — Place an order (auth)
- `GET /api/orders/my` — Get current user's orders (auth)
- `GET /api/orders/:id` — Get specific order (auth)
- `GET /api/admin/orders` — Get all orders (admin)
- `PUT /api/admin/orders/:id/status` — Update order status (admin)
- `GET /api/admin/analytics` — Revenue & order analytics (admin)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Customer Frontend | React 18 + Vite + TypeScript, React Router v6, Framer Motion, React Hot Toast |
| Admin Frontend | React 18 + Vite + TypeScript, Chart.js + react-chartjs-2 |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## Production Build

```bash
# Build backend
cd server && npm run build

# Build customer app
cd client && npm run build

# Build admin panel
cd admin && npm run build
```

The built frontend files can be served as static assets from the Express server or a CDN.

---

## Contributing & Making Changes

Want to add a new feature, fix a bug, or tweak the design? See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for step-by-step guides covering:

- [Running everything locally](./CONTRIBUTING.md#3-running-the-project-locally)
- [Adding a new API endpoint](./CONTRIBUTING.md#4-how-to-add-a-new-backend-api-endpoint)
- [Adding a new database field](./CONTRIBUTING.md#5-how-to-add-a-new-database-field--model-change)
- [Adding a new page to the customer app](./CONTRIBUTING.md#6-how-to-add-a-new-page-customer-app)
- [Adding a new page to the admin panel](./CONTRIBUTING.md#7-how-to-add-a-new-page-admin-panel)
- [Adding a coupon code or menu category](./CONTRIBUTING.md#8-how-to-add-a-new-menu-item-category-or-coupon)
- [Changing colours / theme](./CONTRIBUTING.md#9-how-to-change-the-visual-theme--colours)
# Digital Café – Server

Node.js/Express/MongoDB backend for the Digital Café application.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and set your MongoDB URI, JWT secret, and admin credentials.

### 3. Run in development mode
```bash
npm run dev
```
The server starts on `http://localhost:5000` by default.

### 4. Seed the database with menu items
```bash
npm run seed
```

### 5. Build for production
```bash
npm run build
npm start
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and receive JWT |
| GET | /api/menu | Public | List all available menu items |
| GET | /api/menu/:id | Public | Get a single menu item |
| POST | /api/menu | Admin | Create a menu item |
| PUT | /api/menu/:id | Admin | Update a menu item |
| DELETE | /api/menu/:id | Admin | Delete a menu item |
| POST | /api/orders | Customer | Place a new order |
| GET | /api/orders/my | Customer | Get current user's orders |
| GET | /api/orders/:id | Customer | Get a specific order |
| GET | /api/admin/orders | Admin | Get all orders |
| PUT | /api/admin/orders/:id/status | Admin | Update order status |
| GET | /api/admin/analytics | Admin | Revenue analytics (last 30 days) |

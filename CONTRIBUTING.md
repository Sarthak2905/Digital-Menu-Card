# Contributing to Digital Café

This guide explains how to make changes to any part of the project — backend API, customer app, or admin panel.

---

## Table of Contents

1. [Project structure](#1-project-structure)
2. [One-time setup](#2-one-time-setup)
3. [Running the project locally](#3-running-the-project-locally)
4. [How to add a new backend API endpoint](#4-how-to-add-a-new-backend-api-endpoint)
5. [How to add a new database field / model change](#5-how-to-add-a-new-database-field--model-change)
6. [How to add a new page (customer app)](#6-how-to-add-a-new-page-customer-app)
7. [How to add a new page (admin panel)](#7-how-to-add-a-new-page-admin-panel)
8. [How to add a new menu item category or coupon](#8-how-to-add-a-new-menu-item-category-or-coupon)
9. [How to change the visual theme / colours](#9-how-to-change-the-visual-theme--colours)
10. [Verifying your changes compile](#10-verifying-your-changes-compile)
11. [Common mistakes and fixes](#11-common-mistakes-and-fixes)

---

## 1. Project structure

```
Digital-Menu-Card/
├── client/          # Customer-facing React app  (port 5173)
│   └── src/
│       ├── api/         # Axios instance + JWT interceptor
│       ├── components/  # Navbar, Footer, MenuCard, CartDrawer, …
│       ├── context/     # AuthContext, CartContext
│       ├── pages/       # One file per page/route
│       └── types/       # Shared TypeScript interfaces
│
├── admin/           # Admin panel React app       (port 5174)
│   └── src/
│       ├── api/         # Axios instance (uses cafe_admin token)
│       ├── components/  # Sidebar, TopBar, AdminRoute
│       ├── context/     # AuthContext (admin only)
│       ├── pages/       # Dashboard, MenuManagement, OrderManagement, Analytics, TableQR
│       └── types/       # Shared TypeScript interfaces
│
└── server/          # Express + MongoDB API        (port 5000)
    └── src/
        ├── config/      # db.ts — MongoDB connection
        ├── middleware/  # auth.ts (JWT), adminAuth.ts (role guard)
        ├── models/      # Mongoose schemas: User, MenuItem, Order
        ├── routes/      # auth.ts, menu.ts, orders.ts, admin.ts
        └── scripts/     # seed.ts — populate demo menu items
```

---

## 2. One-time setup

```bash
# 1. Clone / open the repository
cd Digital-Menu-Card

# 2. Create the server environment file
cp .env.example server/.env
# Edit server/.env — at minimum set MONGO_URI and JWT_SECRET

# 3. Install dependencies for all three packages
cd server && npm install && cd ..
cd client && npm install && cd ..
cd admin  && npm install && cd ..
```

---

## 3. Running the project locally

Open **three terminal tabs** and run one command in each:

| Tab | Directory | Command | URL |
|-----|-----------|---------|-----|
| 1 | `server/` | `npm run dev` | http://localhost:5000 |
| 2 | `client/` | `npm run dev` | http://localhost:5173 |
| 3 | `admin/`  | `npm run dev` | http://localhost:5174 |

> **Seed demo data** (first time only):
> ```bash
> cd server && npm run seed
> ```

---

## 4. How to add a new backend API endpoint

**Example: add `GET /api/menu/popular` to return popular items.**

### Step 1 — Add the route handler

Open `server/src/routes/menu.ts` and add your route **before** the `/:id` catch-all:

```typescript
// GET /api/menu/popular — public
router.get('/popular', async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await MenuItem.find({ popular: true, available: true });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
```

### Step 2 — Test it

While `npm run dev` is running in `server/`:

```bash
curl http://localhost:5000/api/menu/popular
```

### Step 3 — Use it from the frontend

In `client/src/api/axios.ts` the base URL is already configured. Just call:

```typescript
import api from '../api/axios';

const { data } = await api.get('/api/menu/popular');
```

### Admin-only endpoints

Wrap with `auth` + `adminAuth` middleware (already imported in `admin.ts`):

```typescript
import auth from '../middleware/auth';
import adminAuth from '../middleware/adminAuth';

router.get('/my-admin-route', auth, adminAuth, async (req, res) => { … });
```

---

## 5. How to add a new database field / model change

**Example: add a `rating` field to `MenuItem`.**

### Step 1 — Update the Mongoose model (`server/src/models/MenuItem.ts`)

```typescript
// Add to the IMenuItem interface:
rating?: number;

// Add to MenuItemSchema:
rating: { type: Number, min: 0, max: 5, default: null },
```

### Step 2 — Update TypeScript types in the frontends

**`client/src/types/index.ts`** and **`admin/src/types/index.ts`**:

```typescript
export interface MenuItem {
  // …existing fields…
  rating?: number;   // ← add this
}
```

### Step 3 — Use the field in the UI

In `client/src/components/MenuCard.tsx`, render it:

```tsx
{item.rating && <span className="rating">⭐ {item.rating}</span>}
```

### Step 4 — Expose it in the admin form

In `admin/src/pages/MenuManagement.tsx`, add an input to the modal form.

---

## 6. How to add a new page (customer app)

**Example: add a `Favourites` page.**

### Step 1 — Create the page file

```bash
touch client/src/pages/Favourites.tsx
```

Minimal page structure:

```tsx
import React from 'react';

const Favourites: React.FC = () => {
  return (
    <div className="page">
      <section className="page-hero">
        <h1>My Favourites</h1>
      </section>
      <section className="section">
        <div className="container">
          {/* Your content */}
        </div>
      </section>
    </div>
  );
};

export default Favourites;
```

### Step 2 — Register the route (`client/src/App.tsx`)

```tsx
import Favourites from './pages/Favourites';

// Inside <Routes>:
<Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
```

Use `<ProtectedRoute>` only if the page requires login. Public pages don't need it.

### Step 3 — Add a nav link (optional)

In `client/src/components/Navbar.tsx`, add to the links list:

```tsx
<li><Link to="/favourites">Favourites</Link></li>
```

---

## 7. How to add a new page (admin panel)

**Example: add a `Settings` page.**

### Step 1 — Create the page file

```bash
touch admin/src/pages/Settings.tsx
```

```tsx
export default function Settings() {
  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
      </div>
      {/* Your content */}
    </div>
  );
}
```

### Step 2 — Register the route (`admin/src/App.tsx`)

```tsx
import Settings from './pages/Settings';

// Inside the <Route path="/admin"> children:
<Route path="settings" element={<Settings />} />
```

### Step 3 — Add to the sidebar (`admin/src/components/Sidebar.tsx`)

```tsx
import { MdSettings } from 'react-icons/md';

// Add to navItems array:
{ to: '/admin/settings', label: 'Settings', icon: MdSettings },
```

---

## 8. How to add a new menu item category or coupon

### New category

1. **Backend model** — `server/src/models/MenuItem.ts`:

   ```typescript
   category: {
     type: String,
     enum: ['Beverages', 'Food', 'Desserts', 'Snacks', 'Combos'],  // ← add here
     required: true,
   },
   ```

2. **Client type** — `client/src/types/index.ts`:

   ```typescript
   category: 'Beverages' | 'Food' | 'Desserts' | 'Snacks' | 'Combos';
   ```

3. **Client filter** — `client/src/pages/Menu.tsx`:

   ```typescript
   const FILTERS = ['All', 'Veg', 'Non-Veg', 'Beverages', 'Food', 'Desserts', 'Snacks', 'Combos'];
   ```

4. **Admin form** — `admin/src/pages/MenuManagement.tsx` — add `'Combos'` to the `<select>` options.

### New coupon code

Open `client/src/context/CartContext.tsx` and add to the `COUPONS` map:

```typescript
const COUPONS: Record<string, number> = {
  WELCOME50: 0.5,   // 50% off
  CAFE10:    0.1,   // 10% off
  NEWUSER20: 0.2,   // ← add new coupon: 20% off
};
```

---

## 9. How to change the visual theme / colours

All design tokens live in CSS custom properties. Edit one file per app:

| App | File |
|-----|------|
| Customer | `client/src/index.css` |
| Admin | `admin/src/index.css` |

Look for the `:root` block near the top:

```css
:root {
  --primary:   #1a3c34;   /* Forest green — main brand colour */
  --secondary: #d4a96a;   /* Warm gold / coffee              */
  --accent:    #f5e6d3;   /* Cream                            */
  --bg:        #faf8f5;   /* Off-white page background        */
  --text:      #1a1a1a;   /* Main text                        */
  --card-bg:   #ffffff;   /* Card backgrounds                 */
}
```

Change any value and it updates the whole app instantly because all components reference these variables.

---

## 10. Verifying your changes compile

Run the TypeScript compiler (no bundling, just type-checking) in each package:

```bash
# Server
cd server && npm run build

# Customer app
cd client && npm run build

# Admin panel
cd admin && npm run build
```

All three should report **✓ built** with zero errors before you commit.

---

## 11. Common mistakes and fixes

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| "Access denied" on admin login | Wrong response shape read in `AuthContext` | Ensure you read `data.user.role`, not `data.role` |
| Cart items disappear on refresh | `localStorage` key mismatch | Both `CartContext` and any new code must use the key `cafe_cart` |
| API call returns 401 | JWT not attached | Check that your page uses `import api from '../api/axios'` (not plain `axios`) |
| New model field not saved to DB | Field missing in Mongoose schema | Add it to both the TypeScript interface **and** the `Schema` object |
| New route returns 404 | Route not mounted in `index.ts` | Open `server/src/index.ts` and add `app.use('/api/your-route', yourRouter)` |
| TypeScript error: "Property X does not exist" | Type interface not updated | Update the matching interface in `src/types/index.ts` of the affected app |

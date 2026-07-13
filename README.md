#  BootZone — Premium Football Boots E-Commerce

A production-ready, full-stack e-commerce application for premium football boots from **Nike**, **Adidas**, **Puma**, and **Mizuno**. Built with React, Vite, Node.js, Express, and MySQL.

![BootZone](https://img.shields.io/badge/BootZone-Premium-F05B0D?style=for-the-badge&logo=football)

---

##  Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Default Admin Credentials](#default-admin-credentials)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [License](#license)

---

##  Overview

BootZone is a premium online store that sells authentic football boots from only four legendary brands: Nike, Adidas, Puma, and Mizuno. The platform features a customer-facing storefront and a complete admin dashboard for managing products, orders, customers, and reviews.

---

##  Tech Stack

### Frontend
- **React.js 18** — UI library
- **Vite 5** — Build tool & dev server
- **React Router DOM 6** — Routing
- **Tailwind CSS 3** — Styling
- **Axios** — HTTP client
- **React Icons** — Icon library
- **React Hook Form** — Forms
- **Context API** — State management
- **Framer Motion** — Animations
- **React Hot Toast** — Notifications

### Backend
- **Node.js** — Runtime
- **Express.js** — Web framework
- **MySQL 8** — Database (via `mysql2`)
- **JWT** — Authentication
- **bcrypt** — Password hashing
- **Multer** — File uploads
- **Express Validator** — Validation
- **dotenv**, **CORS**, **Cookie Parser** — Utilities

---

##  Project Structure

```
bootzone/
├── client/                      # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AnnouncementBar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductCardSkeleton.jsx
│   │   │   ├── SectionHeading.jsx
│   │   │   └── StarRating.jsx
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── hooks/
│   │   │   └── useScrollToTop.js
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── Customers.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   └── Reviews.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Wishlist.jsx
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── catalogService.js
│   │   │   ├── productService.js
│   │   │   └── shopService.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Node.js backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── catalogController.js
│   │   ├── contactController.js
│   │   ├── dashboardController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validateMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── brandRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── userRoutes.js
│   │   └── wishlistRoutes.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── generateToken.js
│   │   └── seeder.js
│   ├── uploads/.gitkeep
│   ├── .env
│   ├── database.sql
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

---

##  Features

### Customer Storefront
- **Home Page** — Hero banner, featured boots, shop by brand, new arrivals, best sellers, why choose us, customer reviews, newsletter
- **Products Page** — Advanced filtering (brand, price, surface, size, search), sorting, pagination
- **Product Detail** — Image gallery with zoom, size selector, quantity, add to cart, wishlist, related products, reviews tab
- **Cart** — Add/remove items, quantity adjustment, promo codes (try `BOOT10`), order summary
- **Wishlist** — Save favorite products
- **Checkout** — Shipping form, payment method selection (COD / Card demo)
- **User Account** — Profile management, password change, order history
- **Authentication** — JWT login/register, remember me, forgot password flow

### Admin Dashboard
- **Dashboard** — Revenue chart, order status breakdown, top products, low-stock alerts
- **Products** — Full CRUD with image URLs, sizes, stock, featured/new/best-seller flags
- **Orders** — View all orders, update order & payment status
- **Customers** — List, search, delete customers
- **Categories & Brands** — Manage catalog structure
- **Reviews** — Approve / hide / delete customer reviews

### Design & UX
- 8-point spacing grid
- Custom Tailwind design system (ink/flame/pitch color palette)
- Bebas Neue display font + Inter body font
- Framer Motion animations
- Fully responsive (mobile, tablet, laptop, desktop)
- Accessible components

---

##  Prerequisites

Before you begin, ensure you have installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MySQL** v8 or higher — [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

---

##  Installation & Setup

### Step 1: Clone or unzip the project

```bash
# If you received a zip, unzip it
unzip bootzone.zip
cd bootzone
```

### Step 2: Set up the MySQL database

1. Start MySQL server
2. Run the schema script (this creates the database, tables, and seed data):

```bash
mysql -u root -p < server/database.sql
```

Or open MySQL Workbench / phpMyAdmin and import `server/database.sql`.

### Step 3: Configure backend environment

Edit `server/.env` to match your MySQL credentials:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bootzone

JWT_SECRET=bootzone_super_secret_key_change_in_production_2024
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Step 4: Install backend dependencies & start

```bash
cd server
npm install
npm run dev
```

The API will be available at `http://localhost:5000/api`.

### Step 5: Configure frontend environment

The `client/.env` file is pre-configured:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Install frontend dependencies & start

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

### Step 7: Re-seed admin password (recommended)

The seeded admin password hash in `database.sql` is a placeholder. After first run, register a new admin or update the password via MySQL:

```sql
-- After starting the server once, you can also update the password directly.
-- Or simply register a customer and promote them via:
UPDATE users SET role='admin' WHERE email='your-email@example.com';
```

---

##  Default Admin Credentials

After seeding the database, an admin account is created:

```
Email:    
Password: 
```

> **Note**: If the placeholder hash doesn't work, register a new account and run:
> ```sql
> UPDATE users SET role='admin' WHERE email='your-email@example.com';
> ```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
| Method | Endpoint              | Description            | Access  |
|--------|-----------------------|------------------------|---------|
| POST   | `/auth/register`      | Register a new user    | Public  |
| POST   | `/auth/login`         | Login user             | Public  |
| POST   | `/auth/logout`        | Logout user            | Public  |
| GET    | `/auth/me`            | Get current user       | Private |
| PUT    | `/auth/profile`       | Update profile         | Private |
| PUT    | `/auth/password`      | Change password        | Private |
| POST   | `/auth/forgot-password` | Request reset token  | Public  |
| POST   | `/auth/reset-password`  | Reset password       | Public  |

### Products
| Method | Endpoint                  | Description            | Access  |
|--------|---------------------------|------------------------|---------|
| GET    | `/products`               | List with filters      | Public  |
| GET    | `/products/:slug`         | Get by slug            | Public  |
| GET    | `/products/:slug/related` | Related products       | Public  |
| GET    | `/products/meta/surfaces` | Distinct surfaces      | Public  |
| POST   | `/products`               | Create                 | Admin   |
| PUT    | `/products/:id`           | Update                 | Admin   |
| DELETE | `/products/:id`           | Delete                 | Admin   |

### Brands & Categories
| Method | Endpoint                | Description | Access |
|--------|-------------------------|-------------|--------|
| GET    | `/brands`               | List brands | Public |
| GET    | `/brands/:slug`         | Get brand   | Public |
| POST   | `/brands`               | Create      | Admin  |
| PUT    | `/brands/:id`           | Update      | Admin  |
| DELETE | `/brands/:id`           | Delete      | Admin  |
| GET    | `/categories`           | List        | Public |
| POST   | `/categories`           | Create      | Admin  |
| PUT    | `/categories/:id`       | Update      | Admin  |
| DELETE | `/categories/:id`       | Delete      | Admin  |

### Cart, Wishlist, Orders, Reviews
| Method | Endpoint                       | Description        | Access  |
|--------|--------------------------------|--------------------|---------|
| GET    | `/cart`                        | Get cart           | Private |
| POST   | `/cart`                        | Add to cart        | Private |
| PUT    | `/cart/:id`                    | Update quantity    | Private |
| DELETE | `/cart/:id`                    | Remove item        | Private |
| GET    | `/wishlist`                    | Get wishlist       | Private |
| POST   | `/wishlist`                    | Toggle wishlist    | Private |
| GET    | `/wishlist/check/:productId`   | Check wishlist     | Private |
| POST   | `/orders`                      | Create order       | Private |
| GET    | `/orders`                      | My orders          | Private |
| GET    | `/orders/:id`                  | Order detail       | Private |
| GET    | `/orders/admin/all`            | All orders         | Admin   |
| PUT    | `/orders/:id/status`           | Update status      | Admin   |
| GET    | `/reviews/product/:productId`  | Product reviews    | Public  |
| POST   | `/reviews`                     | Create review      | Private |
| DELETE | `/reviews/:id`                 | Delete review      | Private |

### Admin Dashboard
| Method | Endpoint                          | Description           | Access |
|--------|-----------------------------------|-----------------------|--------|
| GET    | `/dashboard/stats`                | Overview stats        | Admin  |
| GET    | `/dashboard/revenue`              | Monthly revenue       | Admin  |
| GET    | `/dashboard/top-products`         | Top sellers           | Admin  |
| GET    | `/dashboard/order-status`         | Status breakdown      | Admin  |
| GET    | `/dashboard/brand-performance`    | Brand performance     | Admin  |
| GET    | `/users`                          | List users            | Admin  |
| PUT    | `/users/:id`                      | Update user           | Admin  |
| DELETE | `/users/:id`                      | Delete user           | Admin  |
| POST   | `/upload`                         | Upload image          | Admin  |

---

##  Design System

- **Colors**: `ink` (neutral grays), `flame` (orange accent), `pitch` (green accent)
- **Typography**: Bebas Neue (display) + Inter (body)
- **Spacing**: 8-point grid
- **Border radius**: Soft rounded (12px – 32px)
- **Shadows**: Subtle, layered

---

##  Available Scripts

### Client (`client/`)
```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
```

### Server (`server/`)
```bash
npm run dev       # Start with nodemon (http://localhost:5000)
npm start         # Start without nodemon
npm run seed      # Re-seed database
```

---

##  Promo Codes (for testing)

- `BOOT10` — 10% off your cart

---

##  License

MIT © BootZone. Built as a portfolio project.

---

**Enjoy BootZone!** 

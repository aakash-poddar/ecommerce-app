# API Endpoints List

## Authentication APIs

| Method | Endpoint           | Purpose                         |
| ------ | ------------------ | ------------------------------- |
| POST   | /api/auth/register | Register new user               |
| POST   | /api/auth/login    | Login user and return JWT token |
| POST   | /api/auth/logout   | Logout user                     |

---

## Product APIs

| Method | Endpoint                          | Purpose                     |
| ------ | --------------------------------- | --------------------------- |
| GET    | /api/products                     | Get all products            |
| GET    | /api/products/{id}                | Get single product details  |
| GET    | /api/products/search              | Search products             |
| GET    | /api/products/category/{category} | Filter products by category |

---

## Cart APIs

| Method | Endpoint       | Purpose                 |
| ------ | -------------- | ----------------------- |
| POST   | /api/cart      | Add product to cart     |
| GET    | /api/cart      | Get logged-in user cart |
| PUT    | /api/cart/{id} | Update cart quantity    |
| DELETE | /api/cart/{id} | Remove item from cart   |

---

## Wishlist APIs

| Method | Endpoint           | Purpose                   |
| ------ | ------------------ | ------------------------- |
| POST   | /api/wishlist      | Add item to wishlist      |
| GET    | /api/wishlist      | Get wishlist items        |
| DELETE | /api/wishlist/{id} | Remove item from wishlist |

---

## Order APIs

| Method | Endpoint         | Purpose                  |
| ------ | ---------------- | ------------------------ |
| POST   | /api/orders      | Place new order          |
| GET    | /api/orders      | Get user order history   |
| GET    | /api/orders/{id} | Get single order details |

---

## Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/admin/products | Add new product |
| PUT | /api/admin/products/{id} | Update product |
| DELETE | /api/admin/products/{id} | Delete product |
| GET | /api/admin/orders | View all orders |
| PUT | /api/admin/orders/{id}/status | Update order status |
# Database Schema

## Users Table

| Field      | Type         | Description           |
| ---------- | ------------ | --------------------- |
| id         | BIGINT       | Primary Key           |
| name       | VARCHAR(100) | User Name             |
| email      | VARCHAR(150) | Unique Email          |
| password   | VARCHAR(255) | Hashed Password       |
| role       | VARCHAR(20)  | USER / ADMIN          |
| created_at | TIMESTAMP    | Account Creation Time |

---

## Products Table

| Field       | Type          | Description          |
| ----------- | ------------- | -------------------- |
| id          | BIGINT        | Primary Key          |
| name        | VARCHAR(150)  | Product Name         |
| description | TEXT          | Product Description  |
| price       | DECIMAL(10,2) | Product Price        |
| image_url   | VARCHAR(255)  | Product Image URL    |
| category    | VARCHAR(100)  | Product Category     |
| stock       | INT           | Available Stock      |
| created_at  | TIMESTAMP     | Product Created Time |

---

## Cart Table

| Field      | Type      | Description        |
| ---------- | --------- | ------------------ |
| id         | BIGINT    | Primary Key        |
| user_id    | BIGINT    | FK → users.id      |
| product_id | BIGINT    | FK → products.id   |
| quantity   | INT       | Product Quantity   |
| added_at   | TIMESTAMP | Added To Cart Time |

---

## Wishlist Table

| Field      | Type      | Description         |
| ---------- | --------- | ------------------- |
| id         | BIGINT    | Primary Key         |
| user_id    | BIGINT    | FK → users.id       |
| product_id | BIGINT    | FK → products.id    |
| created_at | TIMESTAMP | Wishlist Added Time |

---

## Orders Table

| Field          | Type          | Description           |
| -------------- | ------------- | --------------------- |
| id             | BIGINT        | Primary Key           |
| user_id        | BIGINT        | FK → users.id         |
| total_amount   | DECIMAL(10,2) | Total Order Amount    |
| address        | TEXT          | Delivery Address      |
| phone          | VARCHAR(15)   | Customer Phone Number |
| payment_method | VARCHAR(50)   | Cash On Delivery      |
| status         | VARCHAR(30)   | PENDING / DELIVERED   |
| order_date     | TIMESTAMP     | Order Date & Time     |

---

## Order_Items Table

| Field      | Type          | Description      |
| ---------- | ------------- | ---------------- |
| id         | BIGINT        | Primary Key      |
| order_id   | BIGINT        | FK → orders.id   |
| product_id | BIGINT        | FK → products.id |
| quantity   | INT           | Ordered Quantity |
| price      | DECIMAL(10,2) | Product Price    |
| subtotal   | DECIMAL(10,2) | quantity × price |

---

# Relationships

* One User can have multiple Cart items
* One User can have multiple Wishlist items
* One User can place multiple Orders
* One Order can contain multiple Order Items
* One Product can exist in Cart, Wishlist, and Order Items

---

# Required Backend Entities

* User.java
* Product.java
* Cart.java
* Wishlist.java
* Order.java
* OrderItem.java

---

# User Roles

* USER
* ADMIN

---

# Order Status

* PENDING
* CONFIRMED
* SHIPPED
* DELIVERED
* CANCELLED

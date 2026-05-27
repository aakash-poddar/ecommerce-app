# E-Commerce Application - Day 2 Report

## Project Overview

Backend development and database integration completed using:

* Backend: Spring Boot
* Database: MySQL
* Authentication: Spring Security + JWT
* API Testing: Postman

---

# Completed Tasks

## 1. Database Connection

Successfully connected Spring Boot backend with PostgreSQL database.

Database Name:

```bash id="jlwmf5"
ecommerce_app
```

Configured database properties inside:

```bash id="jlwm28"
src/main/resources/application.properties
```

---

# 2. Backend Package Structure

Created clean backend architecture with the following packages:

```bash id="jlwmy6"
controller/
entity/
repository/
service/
service/impl/
config/
filter/
dto/
util/
```

---

# 3. Models / Entities Created

The following entities were successfully created:

* User
* Product
* Cart
* Order

Additional features prepared for:

* JWT Authentication
* Role-based authorization

---

# 4. Authentication System

Implemented authentication features using Spring Security and JWT.

Completed:

* User Registration API
* User Login API
* Password Encryption using BCrypt
* JWT Token Generation
* UserDetailsService implementation
* JWT Authentication Filter
* Security Configuration

---

# 5. Register API

Endpoint:

```http id="jlwms3"
POST /api/register
```

Features:

* Register new user
* Encrypt password before saving
* Assign default role
* Prevent duplicate email registration

---

# 6. Login API

Endpoint:

```http id="jlwmy7"
POST /api/login
```

Features:

* Authenticate user credentials
* Generate JWT token
* Return authentication response

---

# 7. Product APIs

Implemented Product Management APIs.

## Get All Products

```http id="jlwm6v"
GET /api/products
```

## Get Product By ID

```http id="jlwmnh"
GET /api/products/{id}
```

Features:

* Fetch all products
* Fetch single product details
* Proper error handling for invalid product ID

---

# 8. Service Layer Implementation

Implemented Service Layer architecture for clean code structure.

Created:

* ProductService
* ProductServiceImpl

Architecture Used:

```text id="jlwmu7"
Controller -> Service -> Repository
```

---

# 9. Spring Security Configuration

Configured:

* Stateless session management
* Public APIs for login/register/products
* Protected routes for authenticated users
* JWT filter integration

---

# 10. API Testing using Postman

Successfully tested all APIs:

* Register API
* Login API
* Get Products API
* Get Product By ID API

Postman collection exported and saved inside:

```bash id="jlwmr9"
docs/postman/
```

---

# 11. Backend Server

Backend application successfully running on:

```bash id="jlwm0o"
http://localhost:5000
```

---

# GitHub Repository Link

Add your repository link here:

```bash id="jlwmfq"
https://github.com/yourusername/ecommerce-app
```

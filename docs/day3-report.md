# E-Commerce Application - Day 3 Report

## Project Overview

Frontend development and backend integration completed using:

* Frontend: React + Vite
* Styling: Tailwind CSS
* Backend Integration: Axios
* Routing: React Router DOM
* Authentication: JWT Authentication

---

# Completed Tasks

## 1. Frontend Folder Structure

Created organized frontend architecture inside:

```bash id="jlwm14"
src/
```

Folders created:

```bash id="jlwmht"
components/
pages/
api/
services/
assets/
utils/
```

---

# 2. React Components Created

The following reusable components were created:

* Header
* Footer
* ProductCard

Features implemented:

* Navigation links
* Login / Logout button
* Responsive UI
* Product display card

---

# 3. React Router Setup

Configured routing using React Router DOM.

Routes created:

```text id="jlwmyn"
/
 /login
 /register
 /products
 /products/:id
 /cart
 /wishlist
 /checkout
 /orders
```

---

# 4. Pages Created

The following pages were created:

* Home Page
* Login Page
* Register Page
* Products Page
* Product Detail Page
* Cart Page
* Wishlist Page
* Checkout Page
* Order History Page

---

# 5. Register Page Integration

Connected Register page with backend API.

Endpoint used:

```http id="jlwmgo"
POST /api/register
```

Features:

* User registration
* Form validation
* Error handling
* Success message display

---

# 6. Login Page Integration

Connected Login page with backend API.

Endpoint used:

```http id="jlwm9d"
POST /api/login
```

Features:

* User authentication
* JWT token generation
* Invalid credentials handling

---

# 7. JWT Token Storage

Successfully stored JWT token in browser localStorage after login.

Implemented:

```javascript id="jlwmpp"
localStorage.setItem("token", token);
```

Logout functionality implemented using:

```javascript id="jlwmg3"
localStorage.removeItem("token");
```

---

# 8. Product Listing Page

Integrated frontend with backend product API.

Endpoint used:

```http id="jlwmx1"
GET /api/products
```

Features:

* Fetch products from backend
* Display products dynamically
* Responsive product cards
* Loading and error handling

---

# 9. Product Details Page

Implemented single product details page.

Endpoint used:

```http id="jlwmv2"
GET /api/products/{id}
```

Features:

* Product image
* Product description
* Price display
* Category and stock details

---

# 10. Tailwind CSS Integration

Used Tailwind CSS for responsive UI design.

Implemented:

* Responsive layouts
* Navbar styling
* Buttons and forms
* Product cards
* Page spacing and alignment

---

# 11. Backend Integration

Frontend successfully connected with Spring Boot backend running on:

```bash id="jlwm3m"
http://localhost:5000
```

Axios instance configured for API communication.

---


# GitHub Repository Link


```bash id="jlwm29"
https://github.com/yourusername/ecommerce-app
```

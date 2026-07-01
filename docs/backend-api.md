# Immersive E-Commerce Backend API Specification

This document details the RESTful API endpoints for the immersive, 3D-oriented e-commerce system built with C# and **.NET 10 Web API** following **Clean Architecture** patterns.

---

## Architecture Overview

The backend uses a decoupled Clean Architecture layer layout:
1. **Ecommerce.Domain**: Holds entity aggregates (`Product`, `Category`, `Customer`, `Order`, `Cart`, etc.) and system enums.
2. **Ecommerce.Application**: Defines contracts (`ICartService`, `IProductService`, etc.), Data Transfer Objects (DTOs), and core service orchestrators.
3. **Ecommerce.Infrastructure**: Implements persistence (`ApplicationDbContext` in EF Core), configurations, and external integrations (e.g. `DateTimeProvider`).
4. **Ecommerce.Api**: Slim controller layer serving standard HTTP inputs/outputs with built-in security, CORS policies, rate-limiting, and Swagger documentation.

---

## 1. Categories API (`/api/categories`)

### GET `/api/categories`
Retrieves all active catalog categories ordered by their preset sort order.

* **Response (200 OK)**:
  ```json
  [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Cyberwear",
      "slug": "cyberwear",
      "description": "Premium sci-fi apparel with integrated LED and neural fiber accents.",
      "imageUrl": "/assets/images/categories/cyberwear.jpg",
      "sortOrder": 1
    }
  ]
  ```

### GET `/api/categories/{slug}`
Retrieves a single active category details by its slug identifier.

* **Response (200 OK)**:
  ```json
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Cyberwear",
    "slug": "cyberwear",
    "description": "Premium sci-fi apparel with integrated LED and neural fiber accents.",
    "imageUrl": "/assets/images/categories/cyberwear.jpg",
    "sortOrder": 1
  }
  ```
* **Response (404 Not Found)**:
  ```json
  "Category with slug 'invalid-slug' was not found."
  ```

---

## 2. Products API (`/api/products`)

### GET `/api/products`
Queries and searches the active product catalog.

* **Query Parameters**:
  - `categoryId` (Guid, optional): Filter by a specific category.
  - `searchTerm` (string, optional): Searches in product name, short description, or full description.
  - `featuredOnly` (bool, optional): If `true`, returns only featured items.

* **Response (200 OK)**:
  ```json
  [
    {
      "id": "8489c629-87bd-4ba8-bbda-40662d55e2c5",
      "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "categoryName": "Cyberwear",
      "name": "Helios Visor V2",
      "slug": "helios-visor-v2",
      "shortDescription": "Next-gen AR visor with translation & thermal vision.",
      "price": 1250.00,
      "discountPrice": 999.00,
      "rating": 4.8,
      "reviewCount": 42,
      "imageUrl": "/assets/images/products/helios-visor.jpg",
      "isFeatured": true,
      "stockQuantity": 15
    }
  ]
  ```

### GET `/api/products/featured`
Returns a limited selection of featured products.

* **Query Parameters**:
  - `count` (int, default: 10): Maximum number of featured products to return.

* **Response (200 OK)**: Same array format as `GET /api/products`.

### GET `/api/products/{slug}`
Retrieves complete details of a single product by its slug (including 3D assets, image sliders, and product variants).

* **Response (200 OK)**:
  ```json
  {
    "id": "8489c629-87bd-4ba8-bbda-40662d55e2c5",
    "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "categoryName": "Cyberwear",
    "categorySlug": "cyberwear",
    "name": "Helios Visor V2",
    "slug": "helios-visor-v2",
    "shortDescription": "Next-gen AR visor with translation & thermal vision.",
    "description": "Augmented reality smart visor with real-time HUD, translation overlays, and thermal night vision.",
    "price": 1250.00,
    "discountPrice": 999.00,
    "rating": 4.8,
    "reviewCount": 42,
    "stockQuantity": 15,
    "imageUrl": "/assets/images/products/helios-visor.jpg",
    "modelUrl": "helios_visor_v2.glb",
    "isFeatured": true,
    "images": [
      {
        "id": "4955df1d-93cc-49fc-be3c-1481bd2e9c12",
        "url": "/assets/images/products/helios-visor.jpg",
        "altText": "Helios Visor V2 Front View",
        "sortOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "e93efbe3-91ee-48c3-b461-8ff8128ee3fe",
        "name": "Color",
        "value": "Neon Purple",
        "additionalPrice": 0.00,
        "stockQuantity": 8
      }
    ]
  }
  ```

---

## 3. Cart API (`/api/cart`)

### GET `/api/cart`
Fetches an active cart or creates a brand new cart based on `sessionId` (for anonymous guest users) or `customerId` (for registered customers).

* **Query Parameters** (requires at least one):
  - `sessionId` (string, optional)
  - `customerId` (Guid, optional)

* **Response (200 OK)**:
  ```json
  {
    "id": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
    "sessionId": "guest-session-uuid-1234",
    "items": [],
    "totalAmount": 0.00,
    "totalQuantity": 0
  }
  ```

### POST `/api/cart/{cartId}/items`
Adds a product and a chosen variant specification into the specified cart.

* **Request Body**:
  ```json
  {
    "productId": "8489c629-87bd-4ba8-bbda-40662d55e2c5",
    "quantity": 2,
    "selectedVariantSummary": "Color: Neon Purple"
  }
  ```
* **Response (200 OK)**: Returns the updated `CartDto` representation showing the inserted item and calculated totals.

### PUT `/api/cart/{cartId}/items/{cartItemId}`
Updates the item quantity inside the cart. Set quantity to `0` to delete the item.

* **Request Body**:
  ```json
  {
    "quantity": 5
  }
  ```
* **Response (200 OK)**: Returns the updated `CartDto` structure.

### DELETE `/api/cart/{cartId}/items/{cartItemId}`
Removes an item from the shopping cart.

* **Response (200 OK)**: Returns the updated `CartDto`.

### DELETE `/api/cart/{cartId}/clear`
Completely empties all items in the specified cart.

* **Response (200 OK)**: Returns an empty `CartDto`.

---

## 4. Orders & Checkout API (`/api/orders`)

### POST `/api/orders/checkout`
Deducts stock levels, registers a shipping address, creates an immutable Order record, and clears the associated shopping cart in a single transaction.

* **Request Body**:
  ```json
  {
    "guestEmail": "shopper@cyberwear.com",
    "fullName": "Nova Sterling",
    "phoneNumber": "+1 (555) 901-2099",
    "addressLine1": "98 Sector 7, Cyber Plaza",
    "addressLine2": "Apartment 10B",
    "city": "Neo-Tokyo",
    "state": "Kanto",
    "postalCode": "100-0001",
    "country": "Japan",
    "cartId": "5fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
  ```
* **Response (200 OK - Successful Order Creation)**:
  ```json
  {
    "success": true,
    "message": "Checkout completed successfully.",
    "orderId": "e292eb61-4cc1-4354-bc71-1288b8f2dca5",
    "orderNumber": "ORD-20260701-4921"
  }
  ```
* **Response (400 BadRequest - Empty Cart or Insufficient Stock)**:
  ```json
  {
    "success": false,
    "message": "Insufficient stock for product 'Helios Visor V2'. Available stock: 1"
  }
  ```

### GET `/api/orders/{id}`
Retrieves full details of an order using its Guid ID.

* **Response (200 OK)**:
  ```json
  {
    "id": "e292eb61-4cc1-4354-bc71-1288b8f2dca5",
    "orderNumber": "ORD-20260701-4921",
    "customerEmail": "shopper@cyberwear.com",
    "status": "Pending",
    "paymentStatus": "Pending",
    "totalAmount": 1998.00,
    "shippingAddressSummary": "Nova Sterling, 98 Sector 7, Cyber Plaza, Neo-Tokyo, Kanto 100-0001, Japan",
    "createdAtUtc": "2026-07-01T07:44:00Z",
    "items": [
      {
        "id": "7138bca3-ef72-4b2a-8efc-bb2300b8c381",
        "productId": "8489c629-87bd-4ba8-bbda-40662d55e2c5",
        "productName": "Helios Visor V2",
        "productSlug": "helios-visor-v2",
        "productImageUrl": "/assets/images/products/helios-visor.jpg",
        "quantity": 2,
        "unitPrice": 999.00,
        "totalPrice": 1998.00,
        "selectedVariantSummary": "Color: Neon Purple"
      }
    ]
  }
  ```

### GET `/api/orders/number/{orderNumber}`
Retrieves full details of an order using its string OrderNumber (e.g., `ORD-20260701-4921`).

* **Response (200 OK)**: Same format as `GET /api/orders/{id}`.

### GET `/api/orders/customer/{customerId}`
Retrieves a customer's order history ordered newest to oldest.

* **Response (200 OK)**: Array of `OrderDto` objects.

---

## 5. Admin Products API (`/api/admin/products`)

### POST `/api/admin/products`
Inserts a new product into the catalog database.

* **Request Body**:
  ```json
  {
    "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Starlight Cloak",
    "slug": "starlight-cloak",
    "shortDescription": "Fibre-optic glowing cloak with solar charging.",
    "description": "Detailed multi-paragraph description of the cloak functionality...",
    "price": 350.00,
    "discountPrice": 299.00,
    "stockQuantity": 30,
    "imageUrl": "/assets/images/products/cloak.jpg",
    "modelUrl": "cloak.glb",
    "isFeatured": false
  }
  ```
* **Response (210 Created)**: Returns the newly generated `ProductDetailDto` with a `Location` header resolving to `GET /api/products/starlight-cloak`.

### PUT `/api/admin/products/{id}`
Modifies fields of an existing product in the catalog.

* **Request Body**: Similar schema to POST, with the addition of `isActive`.
  ```json
  {
    "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Starlight Cloak (Modified)",
    "slug": "starlight-cloak-v2",
    "shortDescription": "Fibre-optic glowing cloak with solar charging.",
    "description": "Updated multi-paragraph description...",
    "price": 380.00,
    "discountPrice": null,
    "stockQuantity": 15,
    "imageUrl": "/assets/images/products/cloak-v2.jpg",
    "modelUrl": "cloak_v2.glb",
    "isFeatured": true,
    "isActive": true
  }
  ```
* **Response (200 OK)**: Returns the updated `ProductDetailDto`.

### DELETE `/api/admin/products/{id}`
Deletes a product from the database catalog.

* **Response (240 NoContent)**: Successful deletion.

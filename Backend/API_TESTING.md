# Backend API Testing Guide

## 1. Coupon APIs

### Apply Coupon to Cart

```bash
POST http://localhost:3000/api/phyco/cart/apply-coupon
Content-Type: application/json

{
  "code": "DISCOUNT10",
  "sessionId": "guest-session-123"
}
```

**Expected Response:**

```json
{
  "message": "Coupon applied successfully",
  "data": {
    "id": 1,
    "couponCode": "DISCOUNT10",
    "discount": 5000,
    "subtotal": 50000,
    "total": 45000,
    "items": [...]
  }
}
```

### Remove Coupon from Cart

```bash
DELETE http://localhost:3000/api/phyco/cart/remove-coupon?sessionId=guest-session-123
```

## 2. Guest Checkout APIs

### Create Order (Guest)

```bash
POST http://localhost:3000/api/phyco/orders
Content-Type: application/json

{
  "sessionId": "guest-session-123",
  "customerInfo": {
    "name": "Nguyễn Văn A",
    "email": "customer@example.com",
    "phone": "+84901234567"
  },
  "items": [
    {
      "variationId": 1,
      "quantity": 2
    }
  ],
  "address": {
    "fullName": "Nguyễn Văn A",
    "phone": "+84901234567",
    "address": "123 Lê Hồng Phong",
    "ward": "Phường 1",
    "district": "Quận 10",
    "city": "TP. Hồ Chí Minh"
  },
  "paymentMethod": "BANK_TRANSFER",
  "totalAmount": 45000,
  "discount": 5000
}
```

### Get Orders by SessionId

```bash
GET http://localhost:3000/api/phyco/orders?sessionId=guest-session-123
```

## 3. Test Coupon Creation

First, create a test coupon in database:

```sql
INSERT INTO "PhycoCoupon" (
  code, type, value, "minAmount", "maxDiscount",
  "startDate", "endDate", "isActive", "usageLimit", "usedCount",
  "createdAt", "updatedAt"
) VALUES (
  'DISCOUNT10', 'percentage', 10, 10000, 10000,
  NOW(), NOW() + INTERVAL '30 days', true, 100, 0,
  NOW(), NOW()
);

INSERT INTO "PhycoCoupon" (
  code, type, value, "minAmount", "maxDiscount",
  "startDate", "endDate", "isActive", "usageLimit", "usedCount",
  "createdAt", "updatedAt"
) VALUES (
  'SAVE5K', 'fixed', 5000, 20000, NULL,
  NOW(), NOW() + INTERVAL '30 days', true, NULL, 0,
  NOW(), NOW()
);
```

## 4. API Endpoints Summary

### Cart APIs

- `GET /api/phyco/cart` - Get cart (with coupon data)
- `POST /api/phyco/cart/items` - Add item to cart
- `PUT /api/phyco/cart/items/:id` - Update quantity
- `DELETE /api/phyco/cart/items/:id` - Remove item
- `DELETE /api/phyco/cart` - Clear cart
- **`POST /api/phyco/cart/apply-coupon`** ✨ NEW
- **`DELETE /api/phyco/cart/remove-coupon`** ✨ NEW

### Order APIs

- `POST /api/phyco/orders` - Create order (supports guest checkout) ✨ UPDATED
- `GET /api/phyco/orders` - Get orders (supports sessionId filter) ✨ UPDATED
- `GET /api/phyco/orders/:id` - Get order by ID
- `PATCH /api/phyco/orders/:id/status` - Update order status
- `POST /api/phyco/orders/:id/cancel` - Cancel order

## 5. Testing Workflow

### Step 1: Add Product to Cart

```bash
POST /api/phyco/cart/items
{
  "productId": 1,
  "quantity": 2,
  "sessionId": "guest-session-123"
}
```

### Step 2: Apply Coupon

```bash
POST /api/phyco/cart/apply-coupon
{
  "code": "DISCOUNT10",
  "sessionId": "guest-session-123"
}
```

### Step 3: Get Cart (verify discount)

```bash
GET /api/phyco/cart?sessionId=guest-session-123
```

### Step 4: Create Order

```bash
POST /api/phyco/orders
{
  "sessionId": "guest-session-123",
  "customerInfo": {...},
  "items": [...],
  "address": {...},
  "paymentMethod": "COD"
}
```

### Step 5: Verify Cart Cleared

```bash
GET /api/phyco/cart?sessionId=guest-session-123
```

Should return empty cart.

## Error Handling

### Coupon Validation Errors

- `Invalid coupon code` - Coupon not found
- `Coupon is inactive` - Coupon disabled
- `Coupon is not yet valid` - Before start date
- `Coupon has expired` - After end date
- `Coupon usage limit reached` - Max uses reached
- `Minimum order amount is XXX₫` - Cart total too low

### Guest Checkout Errors

- `Either userId or sessionId is required` - Missing both
- `Customer name, email and phone are required for guest checkout` - Missing customer info
- `Product must have variations` - Simple products not supported yet

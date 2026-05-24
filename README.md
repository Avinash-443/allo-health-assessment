# Allo Inventory Reservation System

Live URL: https://allo-health-inventory-management.vercel.app

## Overview

This project is an implementation of the Allo Engineering take-home exercise for building a temporary inventory reservation system for multi-warehouse inventory management.

The primary objective of the system is to prevent overselling when multiple customers attempt to purchase the same inventory simultaneously.

Instead of permanently reducing inventory when a user enters checkout, the application temporarily reserves inventory for a fixed time window. If payment succeeds, the reservation becomes confirmed and inventory is permanently deducted. If payment fails or the reservation expires, inventory is automatically released back into available stock.

The implementation focuses heavily on reservation correctness, concurrency handling, and inventory consistency.

---

## Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase)

### Performance / Cache

- Redis (Upstash)

---

## Features Implemented

### Data Model

Implemented entities:

- Products
- Warehouses
- Inventory
- Reservations

Inventory maintains:

- totalUnits
- reservedUnits
- availableUnits

Reservation maintains:

- PENDING
- CONFIRMED
- RELEASED

Reservation stores:

- expiresAt timestamp

---

## API Endpoints Implemented

### Products

GET /api/products

Returns:

- Product information
- Warehouse inventory
- Available stock

---

### Warehouses

GET /api/warehouses

Returns:

- All warehouse details

---

### Reservations

POST /api/reservations

Creates a reservation.

Returns:

409 → if inventory is unavailable

---

GET /api/reservations

Returns all reservation details.

---

POST /api/reservations/confirm

Confirms reservation and permanently deducts inventory.

---

POST /api/reservations/cancel

Cancels reservation and restores inventory.

---

### Warehouse Management

POST /api/warehouses/manage

Creates warehouses dynamically.

---

### Product Management

POST /api/products/manage

Creates products dynamically.

---

## Frontend Implemented

### Dashboard

Displays:

- Products
- Inventory information
- Total inventory
- Reserved inventory
- Available inventory
- Auto refresh

---

### Reservation Page

Displays:

- Reservation details
- Live countdown timer
- Confirm button
- Cancel button
- Automatic UI updates

Behavior:

- No manual refresh required
- Reservation state updates automatically

---

### Product Management

Supports:

- Add products
- Warehouse selection
- Initial stock assignment
- Notifications
- Dynamic updates

---

### Warehouse Management

Supports:

- Add warehouse
- View warehouse list
- Dynamic updates

New warehouses automatically become available throughout the application wherever warehouse selection exists.

---

## Reservation Expiry Mechanism

Each reservation is created with an expiry timestamp to temporarily hold inventory during checkout.

Example:

```ts
expiresAt = currentTime + 10 minutes
```

When a customer initiates a reservation, the requested quantity is not permanently deducted from inventory. Instead, the quantity is moved into the `reservedUnits` state and remains unavailable to other users for a fixed period.

The reservation lifecycle is:

Pending → Confirmed / Released

### Reservation Flow

1. Customer creates a reservation
2. Inventory quantity is moved to `reservedUnits`
3. Reservation enters `PENDING` state
4. Reservation remains valid for 10 minutes
5. User may either:
   - Confirm purchase
   - Cancel reservation
6. If no action is taken before expiry:
   - Reservation becomes `RELEASED`
   - Reserved inventory is restored

### Automatic Cleanup Process

Expired reservations are identified using:

```ts
expiresAt <= currentTime
```

For every expired reservation:

1. Find reservations with:

```ts
status = PENDING
```

2. Change status:

```txt
PENDING → RELEASED
```

3. Restore reserved inventory:

```ts
reservedUnits -= reservation.quantity
```

4. Refresh cached product data so the updated inventory becomes visible in the UI.

### Current Implementation

For this implementation, an API-triggered cleanup mechanism is used.

Cleanup is executed when users actively interact with reservation-related pages and APIs. This approach was selected because it keeps the system simple while remaining suitable for a demo application.

### Production Alternatives

For a production-scale system, a more reliable background processing mechanism would be preferred:

- Scheduled Cron Jobs
- Background Workers
- Queue-based Processing Systems
- Event-driven cleanup services

These approaches ensure cleanup execution even when there are no active users on the platform.

---

## Concurrency Handling

Concurrency correctness was treated as the highest-priority requirement because inventory systems are highly susceptible to race conditions.

The primary problem is preventing multiple users from successfully reserving the same inventory simultaneously.

### Example Problem Scenario

Assume inventory contains:

```txt
Total Units = 5
Reserved Units = 0
Available Units = 5
```

Three users attempt reservations simultaneously:

```txt
User A → Reserve 4 units
User B → Reserve 4 units
User C → Reserve 4 units
```

Without concurrency protection:

```txt
User A → Success
User B → Success
User C → Success
```

Result:

```txt
Reserved Units = 12
Available Units = -7
```

This creates inventory overselling and inconsistent system state.

### Implemented Solution

The application uses:

- Prisma database transactions
- Atomic inventory updates
- Conditional update logic
- Database-level consistency checks

Reservation execution follows this sequence:

```txt
Start Transaction
        ↓
Read Inventory
        ↓
Check Available Quantity
        ↓
Perform Atomic Update
        ↓
Create Reservation
        ↓
Commit Transaction
```

Inventory updates are executed only if inventory remains valid at the exact moment of modification.

Example condition:

```ts
Update inventory only if:

reservedUnits <= totalUnits - requestedQuantity
```

If another request modifies inventory before the current request completes:

```txt
Rows updated = 0
```

The request immediately fails and returns:

```txt
HTTP 409 → Not enough stock
```

### Result

For simultaneous requests:

```txt
Inventory:

Total Units = 5
Reserved Units = 0

Requests:

User A → Reserve 4
User B → Reserve 4
User C → Reserve 4
```

Actual outcome:

```txt
User A → Success
User B → 409 Conflict
User C → 409 Conflict
```

Only one request successfully acquires inventory.

This guarantees:

- No race conditions
- No duplicate reservations
- No inventory overselling
- Consistent inventory state across concurrent requests

## Redis Usage

Redis currently handles:

### Product caching

Cache invalidation occurs whenever:

- Inventory changes
- Reservation changes
- Products are created

Benefits:

- Reduces repeated database reads
- Improves performance

---

## Local Setup

Clone repository:

npm:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Create .env:

```env
DATABASE_URL=your_database_url

DIRECT_URL=your_direct_url

REDIS_URL=your_redis_url

REDIS_TOKEN=your_redis_token
```

Generate Prisma client:

```bash
npx prisma generate
```

Push schema:

```bash
npx prisma db push
```

Seed database:

```bash
npm run seed
```

Run application:

```bash
npm run dev
```

---

## Tradeoffs Made

Due to time constraints, implementation effort was intentionally focused on:

- Reservation correctness
- Inventory consistency
- Concurrency handling
- Reservation lifecycle

Frontend polish and complete commerce workflow features were intentionally given lower priority.

Examples:

- Product purchasing workflow is simplified
- Frontend styling was kept functional instead of production-grade
- Greater emphasis was placed on backend correctness

This was intentional because the assignment specifically emphasized reservation correctness under concurrency.

---

## Missing / Partially Implemented Features

### Idempotency

Bonus requirement:

Not implemented.

Potential approach:

Idempotency-Key Header

↓

Store request result in Redis

↓

Return cached response for retries

---

### Reservation Route Structure

Assignment requested:

POST /api/reservations/:id/confirm

POST /api/reservations/:id/release

Current implementation uses:

POST /api/reservations/confirm

POST /api/reservations/cancel

Behavior remains equivalent although route structure differs.

---

### Enhanced User Error Handling

Current implementation includes basic error handling.

Potential improvements:

- Better toast notifications
- Validation messages
- Error banners
- Better UX feedback

---

## Future Improvements

### Functional

- Delete products
- Delete warehouses
- Edit products
- Edit inventory
- Search functionality
- Filters
- Pagination
- Authentication
- User roles
- Order history
- Complete purchase workflow

### Performance

- Distributed Redis locking
- Background queue processing
- WebSocket live updates
- Better caching strategies

### Reliability

- Idempotency support
- Retry handling
- Structured logging
- Monitoring systems

### UI Improvements

- Better mobile responsiveness
- Dashboard analytics
- Charts
- Inventory metrics
- Skeleton loading states
- Improved notification system

---

## Deployment

Frontend:

Vercel

Database:

Supabase PostgreSQL

Cache:

Upstash Redis

Live URL:

https://allo-health-inventory-management.vercel.app

GitHub Repository:

https://github.com/Avinash-443/allo-health-assessment.git

---

## Final Notes

The primary goal of this implementation was not to create a complete e-commerce platform but to build a reservation system that safely handles inventory under concurrent requests.

The implementation focuses on correctness, race-condition prevention, and maintaining inventory consistency across reservation creation, confirmation, cancellation, and expiry.
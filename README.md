# Allo Inventory Reservation System

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

Reservations are created with:

expiresAt = currentTime + 10 minutes

Automatic cleanup process:

1. Find expired reservations

2. Update status:

PENDING → RELEASED

3. Restore reserved inventory

4. Refresh frontend automatically

Current implementation:

- API-triggered cleanup process

Production alternatives:

- Vercel Cron Job
- Background Worker
- Queue Processing System

---

## Concurrency Handling

Correctness under concurrency was treated as the highest-priority requirement.

Implementation uses:

- Prisma database transactions
- Atomic inventory updates
- Conditional update logic

Flow:

Start transaction

↓

Validate inventory

↓

Atomic inventory update

↓

Create reservation

↓

Commit transaction

This prevents race conditions and overselling.

Example:

Inventory:

Total Units = 5

Reserved Units = 0

Three users simultaneously reserve:

Quantity = 4

Result:

User A → Success

User B → 409

User C → 409

Only one request succeeds.

This guarantees race-condition-safe reservation behavior.

---

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
# Reflex Backend

Backend API for **Reflex** — a delivery coordination system for small Kenyan retailers. Built for Week 3 of the PLP Software Engineering program ("The Readiness Sprint").

Handles delivery requests, customer records, rider assignment, status tracking, and proof-of-delivery, backed by a shared Supabase Postgres database.

## Tech Stack

- **Framework:** NestJS
- **ORM:** Prisma 6.16.2
- **Database:** PostgreSQL (hosted on Supabase)
- **Language:** TypeScript

## Prerequisites

- Node.js v22+ (project tested on v22.22 / v24.14)
- npm
- Access to the team's Supabase project (ask a backend teammate for credentials)

## Setup

1. **Clone the repo and install dependencies**

```bash
   git clone <repo-url>
   cd reflex-backend
   npm install
```

2. **Configure environment variables**

   Create a `.env` file in the project root (copy `.env.example` if present):

```dotenv
   DATABASE_URL="postgresql://postgres.<project-ref>:<url-encoded-password>@<pooler-host>:5432/postgres"
```

   > Get this from a backend teammate or Supabase → Project Settings → Database → Connection string → **Session pooler**. If your password contains special characters (`@`, `#`, etc.), URL-encode them (e.g. `@` → `%40`).

3. **Generate the Prisma client**

```bash
   npx prisma generate
```

4. **Run the dev server**

```bash
   npm run start:dev
```

   Server runs on `http://localhost:3000` by default. CORS is enabled, so frontend dev servers on other ports/origins can call it directly.

## API Endpoints

All resources currently expose standard REST CRUD (`GET` list, `GET :id`, `POST`, `PATCH :id`, `DELETE :id`):

| Resource | Base path |
|---|---|
| Customers | `/customers` |
| Delivery Requests | `/delivery-requests` |
| Proof of Delivery | `/proof-of-delivery` |
| Status Logs | `/status-logs` |
| Sync Events | `/sync-events` |
| Users | `/users` |

Example:
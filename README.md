# Library Management API

A REST API for managing a library catalog, users, categories, book borrowing, returns, and dashboards. The project uses Express, PostgreSQL, Prisma ORM 8, JWT cookies, and Argon2 password hashing.

## Features

- User registration, login, logout, and profile lookup
- Role based access with `ADMIN` and `USER` roles
- Book catalog with filtering, sorting, search, and pagination
- Category management
- Borrowing and returning books with a 14 day due date
- Borrow history and overdue records
- Admin and user dashboards
- Seed script with sample categories, users, books, and borrow records

## Requirements

- Node.js 20 or newer
- PostgreSQL 15 or newer
- npm

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the example file:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS or Linux:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your own values:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/library_db"
   JWT_SECRET="replace-with-a-long-random-secret"
   PORT=4000
   NODE_ENV=development
   ```

   `DATABASE_URL` and `JWT_SECRET` are required. `PORT` defaults to `4000`. `NODE_ENV=production` makes the auth cookie secure.

4. Create the database tables:

   ```bash
   npx prisma db init
   ```

5. Optional: load sample data:

   ```bash
   npm run seed
   ```

6. Start the server:

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:4000` unless you set a different `PORT`.

The `.env.example` file contains a sample remote connection string. Replace it with your own PostgreSQL connection string. The seed script uses a placeholder password hash for its generated users, so register a new account through the API before logging in.

## Environment variables

| Variable       | Required | Description                               |
| -------------- | -------- | ----------------------------------------- |
| `DATABASE_URL` | Yes      | PostgreSQL connection string              |
| `JWT_SECRET`   | Yes      | Secret used to sign JWTs                  |
| `PORT`         | No       | Server port, defaults to `4000`           |
| `NODE_ENV`     | No       | Set to `production` to use secure cookies |

## npm scripts

| Script                  | Description                                 |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Start the server with file watching         |
| `npm run seed`          | Seed the database with sample data          |
| `npm run contract:emit` | Regenerate Prisma contract files            |
| `npm run format`        | Format files with Prettier                  |
| `npm run format:check`  | Check file formatting with Prettier         |
| `npm test`              | Placeholder script, no tests are configured |

## Authentication

Login sets an HTTP only cookie named `access_token` that is valid for 2 days. Send this cookie with later requests to access protected routes.

- `Public`: no authentication required
- `Auth`: valid `access_token` cookie required
- `Admin`: authentication plus the `ADMIN` role required

Admins are created by setting a user's `role` to `ADMIN`. New registrations default to `USER`.

## API endpoints

### Auth

| Method | Endpoint           | Access | Description                                        |
| ------ | ------------------ | ------ | -------------------------------------------------- |
| POST   | `/api/auth/`       | Public | Register a user. Body: `name`, `email`, `password` |
| POST   | `/api/auth/login`  | Public | Log in. Body: `email`, `password`                  |
| POST   | `/api/auth/logout` | Public | Clear the auth cookie                              |
| GET    | `/api/auth/me`     | Auth   | Get the current user profile                       |

### Users

| Method | Endpoint                              | Access                  | Description                                                                            |
| ------ | ------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/api/users`                          | Auth                    | List users with optional `name`, `email`, `role`, `page`, and `limit` query parameters |
| GET    | `/api/users/:id`                      | None in current routing | Get a user by id                                                                       |
| DELETE | `/api/users/:id`                      | None in current routing | Delete a user by id                                                                    |
| PATCH  | `/api/users/:id/status?isActive=true` | Admin                   | Activate or deactivate a user                                                          |

### Books

| Method | Endpoint         | Access | Description                                                                                              |
| ------ | ---------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| POST   | `/api/books`     | Admin  | Add a book. Body: `title`, `author`, `isbn`, `description`, `totalCopies`, `categoryId`                  |
| GET    | `/api/books`     | Auth   | List books. Supports `page`, `limit`, `categoryId`, `available`, `sortBy`, `title`, `author`, and `sort` |
| GET    | `/api/books/:id` | Auth   | Get a book by id                                                                                         |

### Categories

| Method | Endpoint              | Access | Description                                      |
| ------ | --------------------- | ------ | ------------------------------------------------ |
| POST   | `/api/categories`     | Admin  | Add a category. Body: `name`, `description`      |
| GET    | `/api/categories`     | Auth   | List categories                                  |
| PATCH  | `/api/categories/:id` | Admin  | Update a category. Body: `name`, `description`   |
| DELETE | `/api/categories/:id` | Admin  | Delete a category if no books are assigned to it |

### Borrowing

| Method | Endpoint                 | Access | Description                                              |
| ------ | ------------------------ | ------ | -------------------------------------------------------- |
| POST   | `/api/borrow/:bookId`    | Auth   | Borrow a book                                            |
| GET    | `/api/borrow/my`         | Auth   | List books borrowed by the current user                  |
| GET    | `/api/borrow/history`    | Auth   | Get borrow history, all records for admins               |
| GET    | `/api/borrow/overdue`    | Auth   | Get overdue records                                      |
| GET    | `/api/borrow/my-overdue` | Auth   | Get overdue records using the same handler as `/overdue` |
| GET    | `/api/borrow`            | Admin  | List borrow records                                      |
| PATCH  | `/api/borrow/:id/return` | Auth   | Return a borrowed book                                   |

Borrowing rules in the current implementation:

- A user can borrow up to 3 active books
- The same book cannot be borrowed twice while it is already active for that user
- A book must have at least one available copy
- The due date is 14 days from the borrow date
- Returning a book increases its available copy count

### Dashboard

| Method | Endpoint               | Access | Description                                                                  |
| ------ | ---------------------- | ------ | ---------------------------------------------------------------------------- |
| GET    | `/api/dashboard/admin` | Admin  | Get totals for books, categories, users, borrow records, and overdue records |
| GET    | `/api/dashboard/user`  | Auth   | Get borrowed and returned book counts                                        |

## Response format

Successful responses use this shape:

```json
{
  "status": true,
  "statuscode": 200,
  "message": "Request successful",
  "data": null
}
```

Error responses use the same shape with `status` set to `false`.

## Project structure

```text
index.js                  Express app entry point
prisma.config.ts          Prisma CLI configuration
src/
  auth/                   Registration, login, logout, and profile
  book/                   Book routes, controllers, and services
  borrow/                 Borrow and return workflows
  category/               Category routes, controllers, and services
  dashboard/              Admin and user dashboard endpoints
  middleware/             Authentication, role, not found, and error handlers
  prisma/                 Prisma contract, generated files, database client, and seed script
  user/                   User routes, controllers, and services
  utils/                  Response helper functions
migrations/               Stored Prisma migration snapshots
```

## Data model

The Prisma contract in `src/prisma/contract.prisma` defines these models:

- `User`: account details, role, active status, and borrow records
- `Category`: book category and related books
- `Book`: title, author, ISBN, description, copies, and category
- `BorrowRecord`: user, book, borrow date, due date, return date, and status

When you change the contract, run:

```bash
npm run contract:emit
```

Then check migration status with:

```bash
npx prisma migration status
```

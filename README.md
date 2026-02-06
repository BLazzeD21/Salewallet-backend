![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Biome](https://img.shields.io/badge/biome-%2360A5FA.svg?style=for-the-badge&logo=biome&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![PM2](https://img.shields.io/badge/PM2-24036f?style=for-the-badge&logo=pm2)

# ⚒️ API for the SaleWallet cardholder mobile app

# Description

SaleWallet Backend is a server-side REST API written in TypeScript for a local wallet application for cardholders. It handles user logic, card management, transactions, security, and database interaction.

Technology stack: __Node.js, Express, TypeScript, PostgreSQL, Sequelize (ORM), Swagger, JWT, bcrypt, husky, biome, nodemailer, winston, nginx, PM2__

# Docs

## 1. Project structure

```bash
src/
├── config/         # Configuration files (database, mail, logging)
├── controllers/    # Request handlers (routes)
├── errors/         # Error descriptions for controllers
├── html/           # HTML templates
├── middleware/     # Middleware (e.g. auth check, logger)
├── models/         # Sequelize models for DB tables
├── routes/         # Express Route Definitions
├── services/       # Application business logic
├── swagger/        # Swagger documentation configuration
├── tests/          # Described JEST tests
├── types/          # Data types for controllers and models
├── utils/          # Helper functions (error handling, sending emails)
├── app.ts          # Main application file
└── index.ts        # Server initialization
```

## 2. Data schema

- [Database Type](#database-type)
- [Table Structure](#table-structure)
  - [user](#user)
  - [card](#card)
  - [email_verification](#email_verification)
  - [picture](#picture)
- [Relationships](#relationships)
- [Database Diagram](#database-diagram)

### Database type

- **Database system:** PostgreSQL
- **ORM:** Sequelize ORM
### Table structure

### user

| Name        | Type          | Settings                      |
|-------------|-----------------------------------------------|--------------------------------------------------------------|
| **user_id** | UUID | 🔑 PK, not null, unique |  |
| **username** | VARCHAR(50) | not null, unique |  |
| **mail** | VARCHAR(255) | not null, unique |  |
| **password** | VARCHAR(255) | not null |  |
| **confirmed** | BOOLEAN | not null, default: FALSE |  |
| **created_at** | TIMESTAMP | not null, default: CURRENT_TIMESTAMP |  | 

### card

| Name        | Type          | Settings    | References  |
|-------------|---------------|-------------|-------------|
| **card_id** | UUID | 🔑 PK, not null, unique |  | 
| **user_id** | UUID | not null | fk_card_user_id_user | 
| **card_number** | VARCHAR(100) | not null, unique |  | 
| **name** | VARCHAR(30) | not null |  | 
| **description** | VARCHAR(400) | null |  | 
| **color** | VARCHAR(7) | null |  | 
| **barcode** | VARCHAR(255) | not null, unique |  | 
| **barcode_type** | VARCHAR(20) | not null |  | 
| **qr_data** | TEXT | not null, unique |  | 
| **added_at** | TIMESTAMP | not null, default: CURRENT_TIMESTAMP |  |

### email_verification

| Name        | Type          | Settings    | References  |
|-------------|---------------|-------------|-------------|
| **verification_id** | UUID | 🔑 PK, not null, unique |  |
| **user_id** | UUID | not null | fk_email_verification_user_id_user |
| **token** | VARCHAR(255) | not null, unique |  |
| **expires_at** | TIMESTAMP | not null |  |
| **confirmed** | BOOLEAN | not null, default: FALSE |  |
| **created_at** | TIMESTAMP | not null, default: CURRENT_TIMESTAMP |  |

#### Indexes

| Name | Unique | Fields |
|------|--------|--------|
| email_verification_index_0 |  | user_id, confirmed |

### picture

| Name        | Type          | Settings    | References  |
|-------------|---------------|-------------|-------------|
| **picture_id** | UUID | 🔑 PK, not null, unique |  |
| **name** | VARCHAR(100) | not null, unique |  |
| **path** | VARCHAR(255) | not null, unique |  |
| **created_at** | TIMESTAMP | not null, default: CURRENT_TIMESTAMP |  | 

### Relationships

- **email_verification to user**: many_to_one
- **card to user**: many_to_one

### Database Diagram


![Data scheme](assets/drawdb_salewallet.png)

## 3. Endpoint description

Endpoints are accessible via a version-prefixed path: __{domain}/api/v1__

## 👤 User

| Method | Endpoint | Description | Auth |
|-------|----------|----------|----------------|
| `POST` | `/user/register` | Register a new user and send an email to confirm your account | 🚫 |
| `POST` | `/user/login` | User login | 🚫 |
| `POST` | `/user/refresh` | Refresh access token | 🚫 |
| `GET` | `/user/{userId}/confirm-email` | Confirm user email | 🚫 |
| `DELETE` | `/user/{userId}` | Delete authenticated user | ✅ |
| `PATCH` | `/user/change-password` | Change user password | ✅ |

## 💳 Card

| Method | Endpoint | Description | Auth |
|-------|----------|----------|----------------|
| `GET` | `/card` | Get all cards of authenticated user | ✅ |
| `POST` | `/card` | Create a new card for a user | ✅ |
| `DELETE` | `/card/{cardId}` | Delete a user card | ✅ |
| `PATCH` | `/card/{cardId}` | Update a user card | ✅ |

## 📁 Picture

| Method | Endpoint | Description | Auth |
|-------|----------|----------|----------------|
| `POST` | `/picture/upload` | Upload a picture | ✅ |
| `DELETE` | `/picture/delete` | Delete a picture | ✅ |
| `GET` | `/picture/search` | Searches for images by name using fuzzy search | 🚫 |

## 🗄 Other

| Method | Endpoint | Description | Auth |
|-------|----------|----------|----------------|
| `GET` | `/ (without version prefix)` | Returns the line: Server is running | 🚫 |
| `GET` | `/docs` | Swagger docs | 🚫 |




































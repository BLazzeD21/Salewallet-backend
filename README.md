![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Biome](https://img.shields.io/badge/biome-%2360A5FA.svg?style=for-the-badge&logo=biome&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![PM2](https://img.shields.io/badge/PM2-24036f?style=for-the-badge&logo=pm2)

# ⚒️ API for the SaleWallet cardholder mobile app

## Description

SaleWallet Backend is a server-side REST API written in TypeScript for a local wallet application for cardholders. It handles user logic, card management, transactions, security, and database interaction.

Technology stack: __Node.js, Express, TypeScript, PostgreSQL, Sequelize (ORM), Swagger, JWT, bcrypt, husky, biome, nodemailer, winston, nginx, PM2__

## Docs

### 1. Project structure

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











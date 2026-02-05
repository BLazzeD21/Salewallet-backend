import { Router } from "express";

import {
  changePassword,
  confirmEmail,
  deleteUser,
  loginController,
  refreshToken,
  registerController,
} from "@/controllers";

import { verifyAuth } from "@/middlewares";

const router = Router();

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: >
 *       Registers a new user with username, email, and password.
 *       Sends a confirmation email with a verification token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Invalid input or user conflict
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidInputError'
 *                 - $ref: '#/components/schemas/InvalidEmailError'
 *                 - $ref: '#/components/schemas/CredentialsConflictError'
 *                 - $ref: '#/components/schemas/UserAlreadyConfirmedError'
 *                 - $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.post("/user/register", registerController);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User login
 *     description: Authenticate user by username or email and password. Returns access and refresh tokens with user data including cards.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidCredentialsError'
 *       403:
 *         description: Email not confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailNotConfirmedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.post("/user/login", loginController);

/**
 * @openapi
 * /user/refresh:
 *   post:
 *     tags:
 *       - User
 *     summary: Refresh access token
 *     description: Generates a new access token and refresh token using the refresh token from the Authorization header.
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenPair'
 *       400:
 *         description: Refresh token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenRequiredError'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidRefreshTokenError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.post("/user/refresh", refreshToken);

/**
 * @openapi
 * /user/{userId}/confirm-email:
 *   get:
 *     tags:
 *       - User
 *     summary: Confirm user email
 *     description: Confirms a user's email using the verification token.
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *       - $ref: '#/components/parameters/TokenQuery'
 *     responses:
 *       200:
 *         description: Email successfully confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConfirmEmailResponse'
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Email confirmed!</body></html>"
 *       400:
 *         description: Invalid input or token
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidUserIdError'
 *                 - $ref: '#/components/schemas/InvalidTokenInputError'
 *                 - $ref: '#/components/schemas/InvalidTokenError'
 *                 - $ref: '#/components/schemas/TokenExpiredError'
 *       404:
 *         description: User or token not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserNotFoundError'
 *                 - $ref: '#/components/schemas/TokenNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.get("/user/:userId/confirm-email", confirmEmail);

/**
 * @openapi
 * /user/{userId}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete authenticated user
 *     security:
 *       - BearerAuth: []
 *     description: Deletes the authenticated user. Requires password confirmation.
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "StrongPassword123"
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidInputDeleteUserError'
 *                 - $ref: '#/components/schemas/InvalidUUIDFormatError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidCredentialsError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.delete("/user/:userId", verifyAuth, deleteUser);

/**
 * @openapi
 * /user/{userId}/change-password:
 *   patch:
 *     tags:
 *       - User
 *     summary: Change user password
 *     description: Changes the password of the authenticated user. Requires old password verification.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangePasswordResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidUserIdError'
 *                 - $ref: '#/components/schemas/InvalidInputChangePasswordError'
 *       401:
 *         description: Invalid old password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidOldPasswordError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.patch("/user/:userId/change-password", verifyAuth, changePassword);

export { router as authRoutes };

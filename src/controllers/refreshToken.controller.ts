import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

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

export const refreshToken = async (request: Request, response: Response) => {
  try {
    const header = request.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return response.status(401).json({ message: "Token not found in headers" });
    }

    const refreshToken = header.split(" ")[1];

    if (!refreshToken) {
      return response.status(400).json({
        code: "REFRESH_TOKEN_REQUIRED",
        message: "Refresh token is required",
      });
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.AUTH_REFRESH_SECRET) as JwtPayload;

      if (!payload.sub) {
        return response.status(401).json({
          code: "INVALID_REFRESH_TOKEN",
          message: "Invalid refresh token payload",
        });
      }

      const userId = payload.sub as string;

      const accessToken = jwt.sign({ sub: userId }, process.env.AUTH_SECRET, {
        expiresIn: Number(process.env.AUTH_SECRET_EXPIRES_IN),
      });

      const newRefreshToken = jwt.sign({ sub: userId }, process.env.AUTH_REFRESH_SECRET, {
        expiresIn: Number(process.env.AUTH_REFRESH_SECRET_EXPIRES_IN),
      });

      return response.status(200).json({
        accessToken,
        refreshToken: newRefreshToken,
        token_type: "bearer",
      });
    } catch {
      return response.status(401).json({
        code: "INVALID_REFRESH_TOKEN",
        message: "Invalid or expired refresh token",
      });
    }
  } catch {
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};

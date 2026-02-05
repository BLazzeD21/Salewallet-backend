import jwt, { type JwtPayload } from "jsonwebtoken";

import type { Tokens } from "@/types";

import { InvalidRefreshTokenError, RefreshTokenRequiredError, UnauthorizedError } from "@/errors";

export const refresh = async (authorization?: string): Promise<Tokens> => {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const refreshToken = authorization.split(" ")[1];

  if (!refreshToken) {
    throw new RefreshTokenRequiredError();
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.AUTH_REFRESH_SECRET) as JwtPayload;

    if (!payload.sub) {
      throw new InvalidRefreshTokenError();
    }

    const userId = payload.sub as string;

    const accessToken = jwt.sign({ sub: userId }, process.env.AUTH_SECRET, {
      expiresIn: Number(process.env.AUTH_SECRET_EXPIRES_IN),
    });

    const newRefreshToken = jwt.sign({ sub: userId }, process.env.AUTH_REFRESH_SECRET, {
      expiresIn: Number(process.env.AUTH_REFRESH_SECRET_EXPIRES_IN),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      token_type: "bearer",
    };
  } catch {
    throw new InvalidRefreshTokenError();
  }
};

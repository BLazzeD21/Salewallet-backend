import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<JwtPayload, "userId">;
    }
  }
}

declare module "express-serve-static-core" {
  interface Response {
    __loggedStatus?: number;
  }
}

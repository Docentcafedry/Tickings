import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload | string;
    }
  }
}

const requestUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken = req.session?.jwt;
  if (!jwtToken) {
    return next();
  }

  try {
    const payload: JwtPayload | string = jwt.verify(
      jwtToken,
      process.env.jwtSecret!
    );
    req.currentUser = payload;
  } catch (err) {
    throw new Error("Bad JWT credentials");
  }

  next();
};

export { requestUserMiddleware };

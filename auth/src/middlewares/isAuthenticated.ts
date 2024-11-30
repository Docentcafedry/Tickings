import { Request, Response, NextFunction } from "express";
import { IsNotAuthenticated } from "../customErrors/is-not-authenticated";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new IsNotAuthenticated();
  }

  next();
};

export { isAuthenticated };

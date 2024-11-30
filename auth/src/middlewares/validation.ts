import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationCustomError } from "../customErrors/request-validation-error";

const validationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationCustomError(errors.array());
  }

  next();
};

export { validationMiddleware };

import { Request, Response, NextFunction } from "express";
import { CustomError } from "../customErrors/custom-error-abstract";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeError() });
  } else {
    console.log(err.message);
    res.status(400).send({ errors: [{ message: "Generic error" }] });
  }
};

export { errorHandler };

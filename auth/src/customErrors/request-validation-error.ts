import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error-abstract";

export class ValidationCustomError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Request validation error");

    Object.setPrototypeOf(this, ValidationCustomError.prototype);
  }

  serializeError() {
    return this.errors.map((error) => {
      if (error.type === "field") {
        return { message: error.msg, field: error.path };
      } else {
        return { message: error.msg };
      }
    });
  }
}

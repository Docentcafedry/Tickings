import { CustomError } from "./custom-error-abstract";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  message = "Eror during occured database connection";

  constructor() {
    super("Eror during occured database connection");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}

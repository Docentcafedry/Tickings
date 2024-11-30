import { CustomError } from "./custom-error-abstract";

export class UnknowRouteError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Unknown request route");

    Object.setPrototypeOf(this, UnknowRouteError.prototype);
  }

  serializeError() {
    return [{ message: "Unknown request route" }];
  }
}

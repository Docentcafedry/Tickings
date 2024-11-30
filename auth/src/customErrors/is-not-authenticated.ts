import { CustomError } from "./custom-error-abstract";

export class IsNotAuthenticated extends CustomError {
  statusCode = 401;

  constructor() {
    super("User is not authenticated");

    Object.setPrototypeOf(this, IsNotAuthenticated.prototype);
  }

  serializeError() {
    return [{ message: "User is not authenticated" }];
  }
}

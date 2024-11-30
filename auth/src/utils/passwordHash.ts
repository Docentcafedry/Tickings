import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export class PasswordHash {
  static async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  static async comparePasswords(
    hashPassword: string,
    providedPassword: string
  ) {
    const compareResult = await bcrypt.compare(providedPassword, hashPassword);
    return compareResult;
  }
}

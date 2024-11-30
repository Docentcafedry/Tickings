import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validationMiddleware } from "../middlewares/validation";
import { User } from "../models/user";
import { BadRequestError } from "../customErrors/request-bad-error";
import { PasswordHash } from "../utils/passwordHash";
import jwt from "jsonwebtoken";
import { requestUserMiddleware } from "../middlewares/user-set-request";

const router = express.Router();

router.post(
  "/auth/signin",
  [
    body("email").isString().isEmail().withMessage("Invalid email"),
    body("password").trim().notEmpty().withMessage("You need provide password"),
  ],
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("There is no such user");
    }

    const validatePassword = await PasswordHash.comparePasswords(
      user.password,
      password
    );
    if (!validatePassword) {
      throw new BadRequestError("Bad credentials");
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.jwtSecret!
    );

    req.session = { jwt: jwtToken };

    res.status(200).send(user);
  }
);

export { router as SignInRouter };

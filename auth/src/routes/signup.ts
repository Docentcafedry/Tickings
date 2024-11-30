import express from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { ValidationCustomError } from "../customErrors/request-validation-error";
import { DatabaseConnectionError } from "../customErrors/database-connection-error";
import { User } from "../models/user";
import { BadRequestError } from "../customErrors/request-bad-error";
import jwt from "jsonwebtoken";
import { validationMiddleware } from "../middlewares/validation";

const router = express.Router();

router.post(
  "/auth/signup",
  [
    body("email").isString().isEmail().withMessage("Invalid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("You need a password between 4 and 20 characters"),
  ],
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      throw new BadRequestError("Such user already exists");
    }

    const newUser = User.build({ email, password });

    await newUser.save();

    const jwtToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.jwtSecret!
    );

    req.session = { jwt: jwtToken };

    res.status(201).send(newUser);
  }
);

export { router as SignUpRouter };

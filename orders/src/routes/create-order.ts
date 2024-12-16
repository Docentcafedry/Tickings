import express from "express";
import { body } from "express-validator";
import { Request, Response } from "express";
import { BadRequestError } from "@docentav/common";
import { validationMiddleware } from "@docentav/common";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/orders/create",
  requestUserMiddleware,
  isAuthenticated,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validationMiddleware,
  async (req: Request, res: Response) => {
    res.status(201).send({});
  }
);

export { router as CreateOrder };

import express from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { ValidationCustomError } from "@docentav/common";
import { DatabaseConnectionError } from "@docentav/common";
import { Ticket } from "../models/ticket";
import { BadRequestError } from "@docentav/common";
import { validationMiddleware } from "@docentav/common";
import { isAuthenticated } from "@docentav/common";
import { JwtPayload } from "jsonwebtoken";
import { requestUserMiddleware } from "@docentav/common";

interface IJwtPayload extends JwtPayload {
  id: any;
}

const router = express.Router();

router.post(
  "/tickets",
  requestUserMiddleware,
  isAuthenticated,
  [
    body("title")
      .isString()
      .isLength({ min: 4, max: 15 })
      .withMessage("Invalid title"),
    body("price")
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage("You need provide price"),
  ],
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findOne({ title });

    if (ticket) {
      throw new BadRequestError("Such ticket already exists");
    }
    const payload = req.currentUser as IJwtPayload;

    const newTicket = Ticket.build({
      title,
      price,
      userId: payload.id,
    });

    await newTicket.save();

    res.status(201).send(newTicket);
  }
);

export { router as CreateTicket };
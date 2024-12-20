import express from "express";
import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { UnknowRouteError } from "@docentav/common";
import { validationMiddleware } from "@docentav/common";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import { body } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { IsNotAuthenticated } from "@docentav/common";
import { client } from "../nats-client";
import { TickedUpdatedEventPublisher } from "../events/TicketUpdatedEventPublisher";

interface IJwtPayload extends JwtPayload {
  id: any;
}

const router = express.Router();

router.put(
  "/api/tickets/update/:id",
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
  async (req: Request, res: Response) => {
    let ticket;
    try {
      ticket = await Ticket.findById(req.params.id);
    } catch (err) {
      throw new UnknowRouteError();
    }
    const currentUser = req.currentUser as IJwtPayload;

    if (ticket?.userId !== currentUser.id) {
      throw new IsNotAuthenticated();
    }

    ticket!.set({ title: req.body.title, price: req.body.price });

    await ticket?.save();
    await new TickedUpdatedEventPublisher(client.client).publish({
      id: ticket!.id,
      title: ticket!.title,
      price: ticket!.price,
      version: ticket!.version,
      userId: ticket!.userId,
    });

    res.status(200).send(ticket);
  }
);

export { router as UpdateTicketRouter };

import express from "express";
import { body } from "express-validator";
import { Request, Response } from "express";
import { BadRequestError, OrderStatus } from "@docentav/common";
import { validationMiddleware } from "@docentav/common";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { UnknowRouteError } from "@docentav/common";
import { Order } from "../models/order";
import { JwtPayload } from "jsonwebtoken";
import { OrderCreatedEventPublisher } from "../events/OrderCreatedEventPublisher";
import { client } from "../nats-client";

interface JwtPayloadWithId extends JwtPayload {
  id: any;
}

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
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new UnknowRouteError();
    }

    const reservedOrder = await ticket.isReserved();

    if (reservedOrder) {
      throw new BadRequestError("This ticket already reserved!");
    }

    const expTime = new Date();

    expTime.setSeconds(expTime.getSeconds() + 15 * 60);

    const payload = req.currentUser as JwtPayloadWithId;

    const order = Order.build({
      userId: payload.id,
      status: OrderStatus.OrderCreated,
      expTime,
      ticket,
    });

    await order.save();
    new OrderCreatedEventPublisher(client.client).publish({
      id: order.id,
      status: OrderStatus.OrderCreated,
      userId: order.userId,
      expTime: expTime.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as CreateOrder };

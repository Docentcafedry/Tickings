import express from "express";
import { body } from "express-validator";
import { BadRequestError } from "@docentav/common";
import { validationMiddleware } from "@docentav/common";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import { Request, Response } from "express";
import { Order } from "../models/Order";
import { UnknowRouteError } from "@docentav/common";
import { IsNotAuthenticated } from "@docentav/common";
import { stripe } from "../stripe";
import { Charge } from "../models/Charge";
import { client } from "../nats-client";
import { ChargeCreatedEventPublisher } from "../events/ChargeCreatedPublisher";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/payments",
  requestUserMiddleware,
  isAuthenticated,
  [
    body("token").not().isEmpty().withMessage("You need provde token!"),
    body("orderId").not().isEmpty(),
  ],
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new UnknowRouteError();
    }

    // @ts-ignore

    if (order.userId != req.currentUser.id) {
      throw new IsNotAuthenticated();
    }

    const charge = await stripe.charges.create({
      amount: order.price * 10,
      // @ts-ignore
      currency: "usd",
      source: "tok_visa",
    });

    const payment = Charge.build({
      orderId: order.id,
      ticketId: order.ticketId,
      stripeId: charge.id,
      // @ts-ignore
      userId: req.currentUser?.id,
    });

    await payment.save();

    await new ChargeCreatedEventPublisher(client.client).publish({
      id: payment.id,
      stripeId: charge.id,
      // @ts-ignore
      userId: req.currentUser?.id,
      orderId: order.id,
      ticketId: order.ticketId,
    });

    res.status(201).send({ success: true });
  }
);

export { router as newPaymentRouter };

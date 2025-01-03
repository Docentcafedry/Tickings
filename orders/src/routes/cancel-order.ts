import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/order";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import { JwtPayload } from "jsonwebtoken";
import { IsNotAuthenticated } from "@docentav/common";
import { OrderStatus } from "@docentav/common";
import { OrderCancelledEventPublisher } from "../events/OrderCancelledEventPublisher";
import { client } from "../nats-client";

interface JwtPayloadWithId extends JwtPayload {
  id: any;
}

const router = express.Router();

router.delete(
  "/api/orders/delete/:orderId",
  requestUserMiddleware,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const payload = req.currentUser as JwtPayloadWithId;
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (order?.userId != payload.id) {
      throw new IsNotAuthenticated();
    }

    order!.status = OrderStatus.OrderCanceled;

    await order?.save();

    new OrderCancelledEventPublisher(client.client).publish({
      id: order?.id,
      version: order!.version,
      ticket: { id: order?.ticket.id },
    });

    res.status(204).send();
  }
);

export { router as CancelOrderRouter };

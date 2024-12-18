import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/order";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import { JwtPayload } from "jsonwebtoken";
import { IsNotAuthenticated } from "@docentav/common";
import { OrderStatus } from "@docentav/common";

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
    const order = await Order.findById(req.params.orderId);

    if (order?.userId != payload.id) {
      throw new IsNotAuthenticated();
    }

    order!.status = OrderStatus.OrderCanceled;

    await order?.save();

    res.status(204).send();
  }
);

export { router as CancelOrderRouter };

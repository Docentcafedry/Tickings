import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/order";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import { JwtPayload } from "jsonwebtoken";
import { IsNotAuthenticated } from "@docentav/common";

interface JwtPayloadWithId extends JwtPayload {
  id: any;
}

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requestUserMiddleware,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const payload = req.currentUser as JwtPayloadWithId;
    const order = await Order.findById(req.params.orderId);

    if (order?.userId != payload.id) {
      throw new IsNotAuthenticated();
    }
    res.status(200).send(order);
  }
);

export { router as ShowOrderRouter };

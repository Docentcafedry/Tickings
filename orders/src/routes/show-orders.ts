import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/order";
import { isAuthenticated } from "@docentav/common";
import { requestUserMiddleware } from "@docentav/common";
import { JwtPayload } from "jsonwebtoken";

interface JwtPayloadWithId extends JwtPayload {
  id: any;
}

const router = express.Router();

router.get(
  "/api/orders",
  requestUserMiddleware,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const payload = req.currentUser as JwtPayloadWithId;
    const orders = await Order.find({ userId: payload.id }).populate("ticket");

    res.status(200).send(orders);
  }
);

export { router as ShowOrdersRouter };

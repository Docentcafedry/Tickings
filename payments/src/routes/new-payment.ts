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

    res.status(201).send();
  }
);

export { router as newPaymentRouter };

import { CustomListener } from "@docentav/common";
import { ExpiratonCompleteEvent } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";
import { OrderStatus } from "@docentav/common";
import { EventChargeCreated } from "@docentav/common";

export class ChargeCreatedListener extends CustomListener<EventChargeCreated> {
  subscription = SubscriptionTypes.ChargeCreated;
  queueGroup = "order-service";
  durableName = "order-service";

  async onMessage(data: EventChargeCreated["data"], msg: Message) {
    const { orderId, stripeId, userId, ticketId } = data;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error(`There is no order with id ${orderId}`);
    }

    order.set({ status: OrderStatus.OrderCompleted });

    await order.save();

    msg.ack();
  }
}

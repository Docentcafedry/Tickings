import { CustomListener } from "@docentav/common";
import { OrderCancelledEvent } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/Order";
import { OrderStatus } from "@docentav/common";

export class OrderCanceledListener extends CustomListener<OrderCancelledEvent> {
  subscription = SubscriptionTypes.OrderCancelled;
  queueGroup = "ticket-service";
  durableName = "ticket-service";

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { ticket, version, id } = data;

    const order = await Order.findOne({ _id: id, version: version - 1 });

    if (!order) {
      throw new Error(`There is no such order with id ${id}:`);
    }

    order.set({ status: OrderStatus.OrderCanceled });

    await order.save();

    msg.ack();
  }
}

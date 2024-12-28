import { CustomListener } from "@docentav/common";
import { ExpiratonCompleteEvent } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";
import { OrderStatus } from "@docentav/common";
import { OrderCancelledEvent } from "@docentav/common";
import { OrderCancelledEventPublisher } from "./OrderCancelledEventPublisher";

export class ExpirationCompleteListener extends CustomListener<ExpiratonCompleteEvent> {
  subscription = SubscriptionTypes.ExpirationComplete;
  queueGroup = "order-service-expiration";
  durableName = "order-service-expiration";

  async onMessage(data: ExpiratonCompleteEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error(`There is no order with id ${orderId}`);
    }

    if (order.status == OrderStatus.OrderCompleted) {
      msg.ack();
    }

    order.set({ status: OrderStatus.OrderCanceled });

    await order.save();

    await new OrderCancelledEventPublisher(this.client).publish({
      id: orderId,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    msg.ack();
  }
}

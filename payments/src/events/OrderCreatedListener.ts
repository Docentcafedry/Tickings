import { CustomListener } from "@docentav/common";
import { OrderCreatedEvent } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/Order";

export class OrderCreatedListener extends CustomListener<OrderCreatedEvent> {
  subscription = SubscriptionTypes.OrderCreated;
  queueGroup = "payments-service";
  durableName = "payments-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, ticket, status, userId, expTime } = data;

    const order = Order.build({
      id,
      status,
      expTime,
      userId,
      price: ticket.price,
      ticketId: ticket.id,
    });

    await order.save();

    msg.ack();
  }
}

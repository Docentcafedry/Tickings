import {
  CustomListener,
  OrderCreatedEvent,
  SubscriptionTypes,
} from "@docentav/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queue/expirationQueue";

export class OrderCreatedListener extends CustomListener<OrderCreatedEvent> {
  subscription = SubscriptionTypes.OrderCreated;
  queueGroup = "expiration-service";
  durableName = "expiration-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      { delay: 6000 }
    );

    
    msg.ack();
  }
}

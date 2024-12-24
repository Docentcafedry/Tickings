import { CustomListener } from "@docentav/common";
import { OrderCreatedEvent } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";
import { TickedUpdatedEventPublisher } from "./TicketUpdatedEventPublisher";

export class OrderCreatedListener extends CustomListener<OrderCreatedEvent> {
  subscription = SubscriptionTypes.OrderCreated;
  queueGroup = "ticket-service";
  durableName = "ticket-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, ticket } = data;

    const ticketExisted = await Ticket.findById(ticket.id);

    if (!ticketExisted) {
      throw new Error(`There is no ticket with id ${ticket.id}`);
    }

    ticketExisted.set({ orderId: id });

    await ticketExisted.save();

    new TickedUpdatedEventPublisher(this.client).publish({
      id: ticketExisted.id,
      title: ticketExisted.title,
      price: ticketExisted.price,
      version: ticketExisted.version,
      userId: ticketExisted.userId,
      orderId: id,
    });

    msg.ack();
  }
}

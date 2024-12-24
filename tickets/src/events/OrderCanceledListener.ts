import { CustomListener } from "@docentav/common";
import { OrderCancelledEvent } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";
import { TickedUpdatedEventPublisher } from "./TicketUpdatedEventPublisher";

export class OrderCanceledListener extends CustomListener<OrderCancelledEvent> {
  subscription = SubscriptionTypes.OrderCancelled;
  queueGroup = "ticket-service";
  durableName = "ticket-service";

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { ticket } = data;

    const ticketExisted = await Ticket.findById(ticket.id);
    console.log(ticketExisted);

    if (!ticketExisted) {
      throw new Error(`There is no ticket with id ${ticket.id}`);
    }

    ticketExisted.set({ orderId: undefined });

    await ticketExisted.save();

    new TickedUpdatedEventPublisher(this.client).publish({
      id: ticketExisted.id,
      title: ticketExisted.title,
      price: ticketExisted.price,
      version: ticketExisted.version,
      userId: ticketExisted.userId,
      orderId: undefined,
    });

    msg.ack();
  }
}

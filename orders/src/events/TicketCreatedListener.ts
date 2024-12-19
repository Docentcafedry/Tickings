import { CustomListener } from "@docentav/common";
import { EventTicketCreated } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";

export class TicketCreatedListener extends CustomListener<EventTicketCreated> {
  subscription = SubscriptionTypes.TicketCreated;
  queueGroup = "order-service";
  durableName = "order-service";
  async onMessage(
    data: EventTicketCreated["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });

    await ticket.save();

    msg.ack();
  }
}

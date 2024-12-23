import { CustomListener } from "@docentav/common";
import { EventTicketUpdated } from "@docentav/common";
import { SubscriptionTypes } from "@docentav/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";

export class TicketUpdatedListener extends CustomListener<EventTicketUpdated> {
  subscription = SubscriptionTypes.TicketUpdated;
  queueGroup = "order-service";
  durableName = "order-service";
  async onMessage(
    data: EventTicketUpdated["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!ticket) {
      throw new Error(`Cant find ticket with version, ${data.version - 1}`);
    }

    ticket.set({ title: data.title, price: data.price });

    await ticket.save();

    msg.ack();
  }
}

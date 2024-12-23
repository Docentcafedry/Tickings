import { Ticket } from "../../models/ticket";
import { client } from "../../nats-client";
import { TicketCreatedListener } from "../TicketCreatedListener";
import { EventTicketUpdated } from "@docentav/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

jest.mock("../../nats-client.ts");

const setup = async () => {
  const listener = new TicketCreatedListener(client.client);

  const createdTicket = Ticket.build({ title: "test", price: 12 });

  const data: EventTicketUpdated["data"] = {
    id: createdTicket.id,
    title: "test1",
    price: 12,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("Update ticket after receiving ticket updated event", () => {
  it("Update ticket after receiving ticket updated event", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
  });
});

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { client } from "../../nats-client";
import { TicketCreatedListener } from "../TicketCreatedListener";
import { EventTicketCreated } from "@docentav/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

jest.mock("../../nats-client.ts");

const setup = async () => {
  const listener = new TicketCreatedListener(client.client);

  const data: EventTicketCreated["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
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

describe("Create ticket after receiving ticket created event", () => {
  it("Create ticket after receiving ticket created event", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
  });
});

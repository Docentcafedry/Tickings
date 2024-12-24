import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { client } from "../../nats-client";
import { OrderCreatedListener } from "../OrderCreatedListener";
import { OrderCreatedEvent } from "@docentav/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus } from "@docentav/common";

jest.mock("../../nats-client.ts");

const setup = async () => {
  const listener = new OrderCreatedListener(client.client);
  const userId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({ title: "test", price: 12, userId });

  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.OrderCreated,
    userId,
    version: 0,
    expTime: "dsadsa",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe("Updates ticket after receiving Order Created Event", () => {
  it("Updates ticket after receiving Order Created Event", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const ticketUpdated = await Ticket.findById(ticket.id);

    expect(ticketUpdated?.orderId).toEqual(data.id);
  });
});

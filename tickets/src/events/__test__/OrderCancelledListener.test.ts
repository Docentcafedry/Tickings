import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { client } from "../../nats-client";
import { OrderCanceledListener } from "../OrderCanceledListener";
import { OrderCancelledEvent } from "@docentav/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus } from "@docentav/common";

jest.mock("../../nats-client.ts");

const setup = async () => {
  const listener = new OrderCanceledListener(client.client);
  const userId = new mongoose.Types.ObjectId().toHexString();
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({ title: "test", price: 12, userId });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, orderId };
};

describe("Updates ticket after receiving Order Cancelled Event", () => {
  it("Updates ticket after receiving Order Cancelled Event", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const ticketUpdated = await Ticket.findById(ticket.id);

    expect(ticketUpdated?.orderId).toEqual(undefined);
  });
});

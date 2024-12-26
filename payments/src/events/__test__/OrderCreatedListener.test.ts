import { app } from "../../app";
import { Order } from "../../models/Order";
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

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.OrderCreated,
    userId,
    version: 0,
    expTime: "dsadsa",
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 12,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("Creates order after receiving Order Created Event", () => {
  it("Creates order after receiving Order Created Event", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order?.id).toEqual(data.id);
  });
});

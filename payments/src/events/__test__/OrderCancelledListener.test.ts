import { app } from "../../app";
import { Order } from "../../models/Order";
import { client } from "../../nats-client";
import { OrderCanceledListener } from "../OrderCancelledListener";
import { OrderCancelledEvent } from "@docentav/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus } from "@docentav/common";

jest.mock("../../nats-client.ts");

const setup = async () => {
  const listener = new OrderCanceledListener(client.client);
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.OrderCreated,
    expTime: "dsadsa",
    userId,
    ticketId: new mongoose.Types.ObjectId().toHexString(),
    price: 12,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: order.ticketId,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, order, msg };
};

describe("Cancel order after receiving Order Cancelled Event", () => {
  it("Creates order after receiving Order Created Event", async () => {
    const { listener, data, msg, order } = await setup();
    console.log(order);

    await listener.onMessage(data, msg);

    const cancelledOrder = await Order.findById(data.id);

    expect(cancelledOrder?.status).toEqual(OrderStatus.OrderCanceled);
  });
});

import { Ticket } from "../../models/ticket";
import { client } from "../../nats-client";
import { ExpirationCompleteListener } from "../ExpirationCompleteListener";
import { ExpiratonCompleteEvent } from "@docentav/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderStatus } from "@docentav/common";

jest.mock("../../nats-client.ts");

const setup = async () => {
  const listener = new ExpirationCompleteListener(client.client);

  const createdTicket = Ticket.build({ title: "test", price: 12 });

  await createdTicket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.OrderCreated,
    expTime: new Date(),
    ticket: createdTicket,
  });

  await order.save();

  const data: ExpiratonCompleteEvent["data"] = {
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

describe("Cancel order after expiration completed event", () => {
  it("Cancel order after expiration completed event", async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const cancelledOrder = await Order.findById(order.id);

    expect(cancelledOrder?.status).toEqual(OrderStatus.OrderCanceled);
  });
});

import request from "supertest";
import { app } from "../../app";
import { client } from "../../nats-client";
import { OrderCreatedListener } from "../../events/OrderCreatedListener";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@docentav/common";
import { stripe } from "../../stripe";

jest.mock("../../nats-client.ts");

describe("POST /api/payments", () => {
  it("should return success response", async () => {
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

    await listener.onMessage(data, msg);

    const cookies = global.getsignincookies(userId);
    await request(app)
      .post("/api/payments")
      .set("Cookie", cookies)
      .expect("Content-Type", /json/)
      .send({ orderId: data.id, token: "321dsa" })
      .expect(201);
  });
});

describe("checking in created charge in stripe", () => {
  it("checking in created charge in stripe", async () => {
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

    await listener.onMessage(data, msg);

    const cookies = global.getsignincookies(userId);
    await request(app)
      .post("/api/payments")
      .set("Cookie", cookies)
      .expect("Content-Type", /json/)
      .send({ orderId: data.id, token: "321dsa" })
      .expect(201);

    const charges = await stripe.charges.list({ limit: 3 });

    const charge = charges.data.find(
      ({ amount }) => amount === data.ticket.price * 10
    );

    expect(charge).toBeDefined();
  });
});

import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { createTicket } from "../../test/setup";

describe("POST /api/orders/create", () => {
  it("should return error response with unvalid ticket id", async () => {
    const cookies = global.getsignincookies();
    const ticketId = new mongoose.mongo.ObjectId();
    return request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .send({ ticketId })
      .expect(404);
  });
});

describe("POST /api/orders/create", () => {
  it("should return error response due ticket already reserved", async () => {
    const cookiesOne = global.getsignincookies();
    const cookiesTwo = global.getsignincookies();

    const ticketOne = await createTicket("Hello", 4);

    await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookiesOne.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookiesTwo.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(400);
  });
});

describe("POST /api/orders/create", () => {
  it("should return successfull response", async () => {
    const cookiesOne = global.getsignincookies();
    const ticketOne = await createTicket("Hello", 4);

    await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookiesOne.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(201);
  });
});

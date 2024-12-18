import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { createTicket } from "../../test/setup";

describe("GET /api/orders", () => {
  it("should return successfull response", async () => {
    const cookies = global.getsignincookies();
    const ticketOne = await createTicket("Hello", 4);

    await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(201);
    const response = await request(app)
      .get("/api/orders")
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .expect(200);

    expect(response.body.length).toEqual(1);
  });
});

describe("GET /api/orders", () => {
  it("should return successfull response with zero orders for new user", async () => {
    const cookies = global.getsignincookies();
    const cookiesTwo = global.getsignincookies();
    const ticketOne = await createTicket("Hello", 4);

    await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(201);
    const response = await request(app)
      .get("/api/orders")
      .expect("Content-Type", /json/)
      .set("Cookie", cookiesTwo.cookie)
      .expect(200);

    expect(response.body.length).toEqual(0);
  });
});

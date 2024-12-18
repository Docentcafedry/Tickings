import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { createTicket } from "../../test/setup";

describe("GET /api/orders/:ordersId", () => {
  it("should return successfull response", async () => {
    const cookies = global.getsignincookies();
    const ticketOne = await createTicket("Hello", 4);

    const orderCreateResponse = await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(201);
    const response = await request(app)
      .get(`/api/orders/${orderCreateResponse.body.id}`)
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .expect(200);

    expect(response.body.userId).toEqual(cookies.user.id);
  });
});

describe("GET /api/orders/:ordersId", () => {
  it("should return error response", async () => {
    const cookies = global.getsignincookies();
    const cookieswo = global.getsignincookies();
    const ticketOne = await createTicket("Hello", 4);

    const orderCreateResponse = await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(201);
    const response = await request(app)
      .get(`/api/orders/${orderCreateResponse.body.id}`)
      .expect("Content-Type", /json/)
      .set("Cookie", cookieswo.cookie)
      .expect(401);
  });
});

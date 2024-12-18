import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { createTicket } from "../../test/setup";

describe("DELETE /api/orders/delete/:ordersId", () => {
  it("should return successfull response", async () => {
    const cookies = global.getsignincookies();
    const ticketOne = await createTicket("Hello", 4);

    const orderCreateResponse = await request(app)
      .post("/api/orders/create")
      .expect("Content-Type", /json/)
      .set("Cookie", cookies.cookie)
      .send({ ticketId: ticketOne.id })
      .expect(201);
    await request(app)
      .delete(`/api/orders/delete/${orderCreateResponse.body.id}`)
      .set("Cookie", cookies.cookie)
      .expect(204);
  });
});

describe("DELETE /api/orders/delete/:ordersId", () => {
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
    await request(app)
      .delete(`/api/orders/delete/${orderCreateResponse.body.id}`)
      .expect("Content-Type", /json/)
      .set("Cookie", cookieswo.cookie)
      .expect(401);
  });
});

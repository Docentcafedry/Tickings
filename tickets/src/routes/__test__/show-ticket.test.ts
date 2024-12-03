import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("GET /api/tickets/:id", () => {
  it("should return successful response", async () => {
    const cookies = global.getsignincookies();
    const response = await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .send({ title: "asdsadsa", price: "321" })
      .expect(201);
    const ticketId = response.body.id;

    const mainRequest = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .expect("Content-Type", /json/);

    return expect(mainRequest.body.id === ticketId);
  });
});

describe("GET /api/tickets/:id", () => {
  it("should return error response with unexisting ticket id", async () => {
    const cookies = global.getsignincookies();

    const fakeTicketId = new mongoose.mongo.ObjectId();

    const response = await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .send({ title: "asdsadsa", price: "321" })
      .expect(201);
    const ticketId = response.body.id;

    await request(app)
      .get(`/api/tickets/${fakeTicketId}`)
      .expect("Content-Type", /json/)
      .expect(404);
  });
});

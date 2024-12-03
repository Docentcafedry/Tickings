import request from "supertest";
import { app } from "../../app";

describe("GET /api/tickets/:id", () => {
  it("should return successful response after updating ticket", async () => {
    const cookies = global.getsignincookies();
    const valuesForUpdating = { title: "updated", price: "123" };
    const response = await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .send({ title: "asdsadsa", price: "321" })
      .expect(201);
    const ticketId = response.body.id;

    const mainRequest = await request(app)
      .put(`/api/tickets/update/${ticketId}`)
      .expect("Content-Type", /json/)
      .set("Cookie", cookies)
      .send({ title: "updated", price: "123" });

    expect(
      mainRequest.body.title === valuesForUpdating.title &&
        mainRequest.body.price === valuesForUpdating.price
    );

    return expect(mainRequest.statusCode === 201);
  });
});

describe("PUT /api/tickets/update/:id", () => {
  it("should return error response during updating ticket with wrong ticket owner", async () => {
    const response = await request(app)
      .post("/tickets")
      .set("Cookie", global.getsignincookies())
      .send({ title: "asdsadsa", price: "321" })
      .expect(201);

    const ticketId = response.body.id;

    return await request(app)
      .put(`/api/tickets/update/${ticketId}`)
      .expect("Content-Type", /json/)
      .set("Cookie", global.getsignincookies())
      .send({ title: "updated", price: "123" })
      .expect(401);
  });
});

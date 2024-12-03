import request from "supertest";
import { app } from "../../app";

describe("GET /api/tickets", () => {
  it("should return successful response", async () => {
    const cookies = global.getsignincookies();
    await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .send({ title: "asdsadsa", price: "321" })
      .expect(201);

    await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .expect("Content-Type", /json/)
      .send({ title: "asdsaddsadsasa", price: "321" })
      .expect(201);

    await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .expect("Content-Type", /json/)
      .send({ title: "asvc", price: "321" })
      .expect(201);

    const mainRequest = await request(app)
      .get("/api/tickets")
      .expect("Content-Type", /json/);

    return expect(mainRequest.body.isLength === 3);
  });
});

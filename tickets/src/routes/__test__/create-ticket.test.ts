import request from "supertest";
import { app } from "../../app";
import { client } from "../../nats-client";

jest.mock("../../nats-client.ts");

describe("POST /tickets", () => {
  it("should return error response 401 without authentication", async () => {
    await request(app)
      .post("/tickets")
      .expect("Content-Type", /json/)
      .send({ title: "asdsadsa", price: "321dsa" })
      .expect(401);
  });
});

describe("POST /tickets", () => {
  it("should return success response with auth", async () => {
    const cookies = global.getsignincookies();
    const response = request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .expect("Content-Type", /json/)
      .send({ title: "asdsadsa", price: "32" })
      .expect(201);
    return response.expect(201);
  });
});

describe("POST /tickets", () => {
  it("should return error response with bad title", async () => {
    const cookies = global.getsignincookies();
    await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .expect("Content-Type", /json/)
      .send({ title: "as", price: "32" })
      .expect(400);
  });
});

describe("POST /tickets", () => {
  it("should return error response with bad price", async () => {
    const cookies = global.getsignincookies();
    await request(app)
      .post("/tickets")
      .set("Cookie", cookies)
      .expect("Content-Type", /json/)
      .send({
        title: "as",
        price:
          "334432432432432432432432432432432432432432432432432432432432432432432432432432432432",
      })
      .expect(400);
  });
});

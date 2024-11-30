import request from "supertest";
import { app } from "../../app";

describe("POST /auth/signup", () => {
  it("should return error response during singning up with wrong data", async () => {
    return request(app)
      .post("/auth/signup")
      .expect("Content-Type", /json/)
      .send({ email: "docent", password: "321" })
      .expect(400);
  });
});

describe("POST /auth/signup", () => {
  it("should return error response during singning up with wrong data", async () => {
    return request(app)
      .post("/auth/signup")
      .expect("Content-Type", /json/)
      .send({ email: "docent", pssword: "321" })
      .expect(400);
  });
});

describe("POST /auth/signup", () => {
  it("should return succeessfull response after signing up", async () => {
    return request(app)
      .post("/auth/signup")
      .expect("Content-Type", /json/)
      .send({ email: "docent@protonmail.com", password: "12345678" })
      .expect(201);
  });
});

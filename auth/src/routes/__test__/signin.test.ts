import request from "supertest";
import { app } from "../../app";

describe("POST /auth/signin", () => {
  it("should return error response during signing in process due wrong data", async () => {
    await request(app)
      .post("/auth/signup")
      .expect("Content-Type", /json/)
      .send({ email: "docent@protonmail.com", password: "1234567" })
      .expect(201);
    await request(app)
      .post("/auth/signin")
      .expect("Content-Type", /json/)
      .send({ email: "docent@protonmail.com", password: "12345678" })
      .expect(400);
  });
});

describe("POST /auth/signin", () => {
  it("should return successfull response during signing in process", async () => {
    await request(app)
      .post("/auth/signup")
      .expect("Content-Type", /json/)
      .send({ email: "docent@protonmail.com", password: "1234567" })
      .expect(201);
    const signInResponse = await request(app)
      .post("/auth/signin")
      .expect("Content-Type", /json/)
      .send({ email: "docent@protonmail.com", password: "1234567" })
      .expect(200);
  });
});

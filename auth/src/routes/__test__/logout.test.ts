import request from "supertest";
import { app } from "../../app";

describe("POST /auth/logout", () => {
  it("should return error response during signing in process due wrong data", async () => {
    await request(app)
      .post("/auth/signup")
      .expect("Content-Type", /json/)
      .send({ email: "docent@protonmail.com", password: "1234567" })
      .expect(201);
    await request(app)
      .post("/auth/signin")
      .expect("Content-Type", /json/)
      .send({ email: "docent@protonmail.com", password: "1234567" })
      .expect(200);

    const logoutResp = await request(app)
      .post("/auth/logout")
      .expect("Content-Type", /json/)
      .expect(200);
    const cookie = logoutResp.get("Set-Cookie");
    if (!cookie) {
      throw new Error("There is no cookie");
    }
  });
});

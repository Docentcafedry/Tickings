import request from "supertest";
import { app } from "../../app";

describe("GET /auth/user/currentuser", () => {
  it("should return successfull response during retriewing current user", async () => {
    const signInResponseCookies = await global.signin();

    const response = await request(app)
      .get("/auth/user/currentuser")
      .set("Cookie", signInResponseCookies!)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.email).toEqual("docent@protonmail.com");
  });
});

describe("GET /auth/user/currentuser", () => {
  it("should return error unauthorized response during retriewing current user", async () => {
    const response = await request(app)
      .get("/auth/user/currentuser")
      .expect("Content-Type", /json/)
      .expect(401);
  });
});

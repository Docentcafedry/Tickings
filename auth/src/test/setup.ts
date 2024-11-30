import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  process.env.jwtSecret = "asdasd";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db?.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "docent@protonmail.com";
  const password = "1234567";

  await request(app)
    .post("/auth/signup")
    .expect("Content-Type", /json/)
    .send({ email, password })
    .expect(201);
  const signInResponse = await request(app)
    .post("/auth/signin")
    .expect("Content-Type", /json/)
    .send({ email, password })
    .expect(200);
  const cookies = signInResponse.get("Set-Cookie");

  if (!cookies) {
    throw new Error("Could not find cookies!");
  }

  return cookies;
};

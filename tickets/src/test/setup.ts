import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var getsignincookies: () => string[];
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

global.getsignincookies = () => {
  const email = "docent@protonmail.com";
  const id = "674dad3bfa38c1561b0b1e2e";

  console.log(process.env.jwtSecret);

  const jwtToken = jwt.sign({ id, email }, process.env.jwtSecret!);

  const session = { jwt: jwtToken };

  const base64 = Buffer.from(JSON.stringify(session)).toString("base64");

  return [`session=${base64}`];
};

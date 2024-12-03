import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
  const id = new mongoose.mongo.ObjectId().toString("hex");

  const jwtToken = jwt.sign({ id, email }, process.env.jwtSecret!);

  return [`session=${jwtToken}`];
};

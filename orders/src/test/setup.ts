import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import { Ticket } from "../models/ticket";

declare global {
  var signin: () => Promise<string[]>;
  var getsignincookies: () => {
    cookie: string[];
    user: { email: string; id: string };
  };
  var signupUser: () => Promise<{ id: string; email: string }>;
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
  const randomToEmail = Math.random().toString(36).substring(2, 7);
  const email = `${randomToEmail}@protonmail.com`;
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

global.getsignincookies = () => {
  const randomToEmail = Math.random().toString(36).substring(2, 7);
  const email = `${randomToEmail}@protonmail.com`;
  const id = new mongoose.mongo.ObjectId().toString("hex");

  const jwtToken = jwt.sign({ id, email }, process.env.jwtSecret!);

  return { cookie: [`session=${jwtToken}`], user: { email, id } };
};

global.signupUser = async () => {
  const randomToEmail = Math.random().toString(36).substring(2, 7);
  const email = `${randomToEmail}@protonmail.com`;
  const password = "1234567";

  const response = await request(app)
    .post("/auth/signup")
    .expect("Content-Type", /json/)
    .send({ email, password })
    .expect(201);

  return response.body;
};

export async function createTicket(title: string, price: number) {
  const ticket = Ticket.build({ title, price });
  await ticket.save();
  return ticket;
}

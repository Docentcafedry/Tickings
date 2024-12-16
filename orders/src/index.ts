import mongoose from "mongoose";
import { app } from "./app";
import { client } from "./nats-client";

const start = async () => {
  try {
    if (!process.env.jwtSecret) {
      throw new Error("Enviroment veriable of jwt secret code not defined!");
    }
    if (!process.env.mongodb) {
      throw new Error("Enviroment veriable of mongodb not defined!");
    }

    if (!process.env.MY_PODE_NAME) {
      throw new Error("Enviroment veriable of MY_PODE_NAME not defined!");
    }
    if (!process.env.NATS_CLUSTER_IP) {
      throw new Error("Enviroment veriable of NATS_CLUSTER_IP not defined!");
    }
    if (!process.env.NATS_URL) {
      throw new Error("Enviroment veriable of NATS_URL not defined!");
    }

    await client.connect(
      process.env.NATS_CLUSTER_IP,
      process.env.MY_PODE_NAME,
      process.env.NATS_URL
    );
    await mongoose.connect(process.env.mongodb!);
    console.log("Successfully connected to db!");
  } catch (err) {
    console.log("Db connection failed", err);
  }
};

app.listen(4000, () => {
  console.log("Listening at 4000");
});

start();

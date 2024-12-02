import mongoose from "mongoose";
import { app } from "./app";

const startMongoose = async () => {
  try {
    await mongoose.connect(process.env.mongodb!);
    console.log("Successfully connected to db!");
  } catch (err) {
    console.log("Db connection failed", err);
  }
};

app.listen(4000, () => {
  console.log("Listening at 4000");
  if (!process.env.jwtSecret) {
    throw new Error("Enviroment veriable of jwt secret code not defined!");
  }
  if (!process.env.mongodb) {
    throw new Error("Enviroment veriable of jwt secret code not defined!");
  }
});

startMongoose();

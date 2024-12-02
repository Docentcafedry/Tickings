import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "@docentav/common";
import { UnknowRouteError } from "@docentav/common";
import { CreateTicket } from "./routes/create-ticket";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import express from "express";

const app = express();

app.set("trust proxy", 1);
app.use(json());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use(CreateTicket);

app.all("*", async () => {
  throw new UnknowRouteError();
});

app.use(errorHandler);

export { app };

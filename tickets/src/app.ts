import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "@docentav/common";
import { UnknowRouteError } from "@docentav/common";
import { CreateTicket } from "./routes/create-ticket";
import { ShowTicketsRouter } from "./routes/show-tickets";
import { ShowTicketRouter } from "./routes/show-ticket";
import { UpdateTicketRouter } from "./routes/update-ticket";
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
app.use(ShowTicketsRouter);
app.use(ShowTicketRouter);
app.use(UpdateTicketRouter);

app.all("*", async () => {
  throw new UnknowRouteError();
});

app.use(errorHandler);

export { app };

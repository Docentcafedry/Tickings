import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "@docentav/common";
import { UnknowRouteError } from "@docentav/common";
import cookieSession from "cookie-session";
import express from "express";
import { newPaymentRouter } from "./routes/new-payment";

const app = express();

app.set("trust proxy", 1);
app.use(json());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use(newPaymentRouter);

app.all("*", async () => {
  throw new UnknowRouteError();
});

app.use(errorHandler);

export { app };

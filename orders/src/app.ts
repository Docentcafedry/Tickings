import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "@docentav/common";
import { UnknowRouteError } from "@docentav/common";
import { CreateOrder } from "./routes/create-order";
import { ShowOrdersRouter } from "./routes/show-orders";
import { ShowOrderRouter } from "./routes/show-order";
import { CancelOrderRouter } from "./routes/cancel-order";
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

app.use(CreateOrder);
app.use(ShowOrdersRouter);
app.use(CancelOrderRouter);
app.use(ShowOrderRouter);

app.all("*", async () => {
  throw new UnknowRouteError();
});

app.use(errorHandler);

export { app };

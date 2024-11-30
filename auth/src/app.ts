import "express-async-errors";
import { json } from "body-parser";
import { LogOutRouter } from "./routes/logout";
import { SignInRouter } from "./routes/signin";
import { SignUpRouter } from "./routes/signup";
import { CurrentUserRouter } from "./routes/currentUser";
import { errorHandler } from "./middlewares/handler";
import { UnknowRouteError } from "./customErrors/unknown-route-error";
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

app.use(SignInRouter);
app.use(CurrentUserRouter);
app.use(SignUpRouter);
app.use(LogOutRouter);

app.all("*", async () => {
  throw new UnknowRouteError();
});

app.use(errorHandler);

export { app };

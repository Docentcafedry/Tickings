import express from "express";
import { requestUserMiddleware } from "../middlewares/user-set-request";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.get(
  "/auth/user/currentuser",
  requestUserMiddleware,
  isAuthenticated,
  (req, res) => {
    const currentUser = req.currentUser;
    res.send(currentUser);
  }
);

export { router as CurrentUserRouter };

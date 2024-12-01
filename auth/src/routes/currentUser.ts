import express from "express";
import { requestUserMiddleware } from "@docentav/common";
import { isAuthenticated } from "@docentav/common";

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

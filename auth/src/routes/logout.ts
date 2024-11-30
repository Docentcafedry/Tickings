import express from "express";

const router = express.Router();

router.post("/auth/logout", (req, res) => {
  req.session = null;
  res.status(200).send({});
});

export { router as LogOutRouter };

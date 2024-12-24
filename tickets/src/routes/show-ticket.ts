import express from "express";
import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { UnknowRouteError } from "@docentav/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new UnknowRouteError();
  }

  res.status(200).send(ticket);
});

export { router as ShowTicketRouter };

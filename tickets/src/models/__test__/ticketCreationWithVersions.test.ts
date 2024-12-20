import request from "supertest";
import { Ticket } from "../ticket";

describe("creates tickets with versions", () => {
  it("should return tickets with versions", async () => {
    const ticket = Ticket.build({ title: "test", price: "323", userId: "123" });
    await ticket.save();
    const ticketOne = await Ticket.findOne({ title: "test" });
    ticketOne?.set({ title: "test1" });
    await ticketOne?.save();
    expect(ticketOne?.version).toEqual(1);
  });
});

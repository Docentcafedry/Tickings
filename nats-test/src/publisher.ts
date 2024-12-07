import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketOrderPublisher } from "@docentav/common";
const stan = nats.connect("ticketing", "client", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Connected to NATS Streaming Server");
  const publisher = new TicketOrderPublisher(stan);
  try {
    await publisher.publish({
      title: "Hello nuts",
      id: randomBytes(4).toString("hex"),
    });
  } catch (err) {
    console.log("An error occured during sending event", err);
  }
});

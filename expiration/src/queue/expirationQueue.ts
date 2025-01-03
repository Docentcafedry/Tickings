import Queue from "bull";
import { ExpirationOrderEventPublisher } from "../events/ExpirationCompletePublisher";
import { client } from "../nats-client";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  console.log("Adding to queue order", job.data.orderId);
  await new ExpirationOrderEventPublisher(client.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };

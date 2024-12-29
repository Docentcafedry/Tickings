import { client } from "./nats-client";
import { OrderCreatedListener } from "./events/OrderCreatedListener";

const start = async () => {
  try {
    if (!process.env.MY_PODE_NAME) {
      throw new Error("Enviroment veriable of MY_PODE_NAME not defined!");
    }
    if (!process.env.NATS_CLUSTER_IP) {
      throw new Error("Enviroment veriable of NATS_CLUSTER_IP not defined!");
    }
    if (!process.env.NATS_URL) {
      throw new Error("Enviroment veriable of NATS_URL not defined!");
    }

    await client.connect(
      process.env.NATS_CLUSTER_IP,
      process.env.MY_PODE_NAME,
      process.env.NATS_URL
    );

    console.log("from expiration");

    new OrderCreatedListener(client.client).listen();
  } catch (err) {
    console.log("Db connection failed", err);
  }
};

start();

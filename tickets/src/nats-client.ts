import { Stan } from "node-nats-streaming";
import nats from "node-nats-streaming";

class NatsClient {
  private _client!: Stan;

  get client() {
    if (!this._client) {
      throw Error("Cant return nats client before connecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, {
      url,
    });

    return new Promise<void>((resolve, reject) => {
      this._client.on("connect", async () => {
        console.log("Connected to NATS Streaming Server");
        resolve();
      });
      this._client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const client = new NatsClient();

import axios from "axios";

export function buildClient(context) {
  console.log(context.headers);
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: context.headers,
    });
  } else {
    return axios.create({ baseURL: "/" });
  }
}

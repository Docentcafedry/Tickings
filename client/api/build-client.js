import axios from "axios";

export function buildClient(context) {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://ticeting-app.art/",
      headers: context.headers,
    });
  } else {
    return axios.create({ baseURL: "/" });
  }
}

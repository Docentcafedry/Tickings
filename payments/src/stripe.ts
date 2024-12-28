import Stripe from "stripe";
export const stripe = new Stripe(process.env.stripeSecret!, {
  apiVersion: "2024-12-18.acacia",
});

import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@docentav/common";

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  expTime: string;
  userId: string;
  ticketId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  expTime: string;
  userId: string;
  ticketId: string;
  price: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    expTime: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    ticketId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, rec) {
        rec.id = rec._id;
        delete rec._id;
      },
    },
  }
);

orderSchema.statics.build = function (attrs: OrderAttrs) {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    expTime: attrs.expTime,
    ticketId: attrs.ticketId,
    price: attrs.price,
    userId: attrs.userId,
  });
};

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };

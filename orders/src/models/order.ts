import mongoose from "mongoose";
import { transform } from "typescript";
import { TicketDoc } from "./ticket";
import { OrderStatus } from "@docentav/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expTime: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
  expTime: Date;
  ticket: TicketDoc;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: OrderStatus.OrderCreated,
    },
    expTime: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.statics.build = function (attr: OrderAttrs) {
  return new Order(attr);
};

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };

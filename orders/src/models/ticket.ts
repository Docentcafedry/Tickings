import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@docentav/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id?: string | null;
  title: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
    },
    orderId: {
      type: String,
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

ticketSchema.statics.build = function (attrs: TicketAttrs) {
  if (attrs.id) {
    return new Ticket({
      _id: attrs.id,
      title: attrs.title,
      price: attrs.price,
    });
  } else {
    return new Ticket({
      title: attrs.title,
      price: attrs.price,
    });
  }
};

ticketSchema.methods.isReserved = async function () {
  const reservedOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.OrderCompleted,
        OrderStatus.OrderCreated,
        OrderStatus.OrderPending,
      ],
    },
  });

  return !!reservedOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

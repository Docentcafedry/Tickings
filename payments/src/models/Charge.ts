import mongoose from "mongoose";

interface ChargeAttrs {
  stripeId: string;
  orderId: string;
  userId: string;
  ticketId: string;
}

interface ChargeDoc extends mongoose.Document {
  stripeId: string;
  orderId: string;
  userId: string;
  ticketId: string;
}

interface ChargeModel extends mongoose.Model<ChargeDoc> {
  build(attrs: ChargeAttrs): ChargeDoc;
}

const chargeSchema = new mongoose.Schema(
  {
    stripeId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    ticketId: {
      type: String,
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

chargeSchema.statics.build = function (attrs: ChargeAttrs) {
  return new Charge(attrs);
};

const Charge = mongoose.model<ChargeDoc, ChargeModel>("Charge", chargeSchema);

export { Charge };

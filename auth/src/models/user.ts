import mongoose from "mongoose";
import { PasswordHash } from "../utils/passwordHash";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = function (attrs: UserAttrs) {
  return new User(attrs);
};

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashedPassword = await PasswordHash.hashPassword(
      this.get("password")
    );
    this.set("password", hashedPassword);
  }
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

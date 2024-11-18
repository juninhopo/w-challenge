import mongoose, { Model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const schema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
      description: "The name of the user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      description: "The email of the user",
    },
  },
  {
    collection: "User",
    timestamps: true,
  }
);

export type IUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;

export const User: Model<IUser> = mongoose.model("User", schema);
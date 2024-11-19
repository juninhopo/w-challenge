import mongoose, { Model, mongo } from "mongoose";

const userPassSchema = new mongoose.Schema<IUserPass>(
  {
    _id: {
      type: String,
      ref: "User",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "UserPass",
    timestamps: true,
  }
)

export type IUserPass = {
  _id: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
} & Document

export const UserPass: Model<IUserPass> = mongoose.model("UserPass", userPassSchema); 
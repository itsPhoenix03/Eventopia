import { Document, Schema, model, models } from "mongoose";

export interface IOrder extends Document {
  _id: string;
  createAt: Date;
  totalAmount: string;
  stripeId: string;
  event: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export type IOrderItems = {
  _id: string;
  createdAt: Date;
  totalAmount: string;
  eventTitle: string;
  eventId: string;
  buyer: string;
};

const OrderSchema = new Schema({
  createdAt: { type: Date, default: Date },
  stripeId: { type: String, require: true },
  totalAmount: { type: String },
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  buyer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;

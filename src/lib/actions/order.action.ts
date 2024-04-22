"use server";

import { Stripe } from "stripe";
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByUserParams,
} from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/model/order.model";
import Event from "../database/model/event.model";
import User from "../database/model/user.model";

// Stripe Functionality Only no DB related stuff
// --------------------------
export async function checkoutOrder(order: CheckoutOrderParams) {
  // Loading up the new stripe instance
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Calculating the price
  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/?canceled=true`,
    });

    redirect(session.url!);
  } catch (error) {
    // Handle Error
    throw error;
  }
}
// --------------------------

export async function createOrder(order: CreateOrderParams) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    await connectToDatabase();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function getOrdersByUser({
  userId,
  page,
  limit = 3,
}: GetOrdersByUserParams) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: userId };

    // Finding the user orders
    const userOrders = await Order.distinct("event._id")
      .find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    // Counting the total orders
    const ordersCount = await Order.distinct("event._id").countDocuments(
      conditions
    );

    return {
      data: JSON.parse(JSON.stringify(userOrders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

"use server";

import { CreateEventParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/model/user.model";
import Event from "../database/model/event.model";
import Category from "../database/model/category.model";

async function populateEvent(query: any) {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
}

export async function createEvent({ event, userId, path }: CreateEventParams) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    await connectToDatabase();

    // Finding the organizer in DB
    const organizer = await User.findById(userId);

    // If organizer is not present then throw error
    if (!organizer) {
      throw new Error("Organizer not found!");
    }

    // Create the new event
    const newEvent = await Event.create({
      ...event,
      organizer: userId,
      category: event.categoryId,
    });

    // Return the newly created event
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function getEventById(eventId: string) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    await connectToDatabase();

    // Fetching the event details from the DB
    // Also populating the organizer and category fields with their actual values instead of their id's
    const eventDetails = await populateEvent(Event.findById(eventId));

    // If no event found throw a new error
    if (!eventDetails) {
      throw new Error("Event not found!");
    }

    // Return the event details
    return JSON.parse(JSON.stringify(eventDetails));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

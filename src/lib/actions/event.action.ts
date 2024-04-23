"use server";

import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/model/user.model";
import Event from "../database/model/event.model";
import Category from "../database/model/category.model";
import { revalidatePath } from "next/cache";

async function getCategoryByName(name: string) {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
}

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

    revalidatePath(path);
    // Return the newly created event
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    await connectToDatabase();

    // Check if the event is present in the DB and the user updating is the creator
    const eventToUpdate = await Event.findById(event._id);

    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );

    // Revalidate the path
    revalidatePath(path);

    // Return the updated event
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    connectToDatabase();

    // Deleting the event from the DB
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    // If their was a deleted then revalidate the path
    if (deletedEvent) revalidatePath(path);
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

export async function getEventByUser({
  userId,
  page,
  limit = 6,
}: GetEventsByUserParams) {
  try {
    // Connecting to DB using the cached connection or creating a new one
    await connectToDatabase();

    // Finding the events organized by user
    const condition = { organizer: userId };
    const skipAmount = (page - 1) * limit;

    const eventQuery = Event.find(condition)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const event = await populateEvent(eventQuery);
    const eventsCount = await Event.countDocuments(event);

    return {
      data: JSON.parse(JSON.stringify(event)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    await connectToDatabase();

    // Finding the events based on the title or search params
    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};

    // Finding events based on the category filter
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    // conditions for searching the events
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    // Skip count
    const skipCount = Number(page - 1) * limit;

    // Searching the events in DB based on the conditions
    // Order for the events is latest events to older events
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipCount)
      .limit(limit);

    // Populating the events for the values of category and organizer
    const events = await populateEvent(eventsQuery);

    // Calculating the total number of events
    const eventsCount = await Event.countDocuments(events);

    // Returning a custom object with data and current page number
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function getRelatedEventByCategory({
  categoryId,
  eventId,
  page,
  limit = 6,
}: GetRelatedEventsByCategoryParams) {
  try {
    // Connecting to DB using the cached connection otherwise creating a new one
    await connectToDatabase();

    // How many documents to skip on page change
    const skipAmount = (Number(page) - 1) * limit;

    // Query condition
    const query = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };
    // Fetching the related events based on the category;
    const relatedEventsQuery = Event.find(query)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    // Populate the values in the event object
    const relatedEvents = await populateEvent(relatedEventsQuery);
    const eventsCount = await Event.countDocuments(query);

    // Return the result
    return {
      data: JSON.parse(JSON.stringify(relatedEvents)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

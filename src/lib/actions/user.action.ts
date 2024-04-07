"use server";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/model/user.model";
import { revalidatePath } from "next/cache";

export async function createUser(user: CreateUserParams) {
  try {
    // Trying to connect to DB using the cached string or creating a new one
    await connectToDatabase();

    // Creating a new user
    const newUser = await User.create(user);

    // Returning a parsed object
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    // Handling error
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    // Trying to connect to DB using the cached string or creating a new one
    await connectToDatabase();

    // Fetching the user based on userId
    const user = await User.findById(userId);

    // If no user found
    if (!user) throw new Error("User not found");

    // Returning the ID of the user
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    // Trying to connect to DB using the cached string or creating the new one
    await connectToDatabase();

    // Update the user
    const updateUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updateUser) throw new Error("Failed to update the user");

    return JSON.parse(JSON.stringify(updateUser));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    // Trying to connect to DB using the cached string or creating a new one
    await connectToDatabase();

    // Finding the User in the DB
    const userToBeDeleted = await User.findOne({ clerkId });

    if (!userToBeDeleted) throw new Error("User not found");

    //TODO: Some more actions are left to done such as:- deleting all the events of the organizer

    // Deleting the user from DB
    const deletedUser = await User.findByIdAndDelete(userToBeDeleted._id);

    // Going back to home page after action is performed
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

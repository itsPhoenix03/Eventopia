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
    console.log("user - ", user);
    // Creating a new user
    const newUser = await User.create(user);

    // Returning a parsed object
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    // Handling error
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    // Trying to connect to DB using the cached string or creating the new one
    await connectToDatabase();

    // Update the user
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
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
    const deletingUser = await User.findOne({ clerkId });

    if (!deletingUser) throw new Error("User not found");

    //TODO: Some more actions are left to done such as:- deleting all the events of the organizer

    // Deleting the user from DB
    const deletedUser = await User.findByIdAndDelete({ clerkId });

    // Going back to home page after action is performed
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

"use server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Category from "../database/model/category.model";

export async function createCategory({ categoryName }: CreateCategoryParams) {
  try {
    // Connecting to DB using the cached connection otherwise create a new one
    await connectToDatabase();

    // Creating a new category in the DB
    const newCategory = await Category.create({ name: categoryName });

    // Returning the new category
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

export async function getAllCategories() {
  try {
    // Connecting to DB using the cached connection otherwise create a new one
    await connectToDatabase();

    // Fetching all the categories from the DB
    const allCategories = await Category.find();

    // Returning the categories
    return JSON.parse(JSON.stringify(allCategories));
  } catch (error) {
    // Error Handling
    handleError(error);
  }
}

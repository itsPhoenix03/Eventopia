import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Must be 3 or more characters long"),
  description: z
    .string()
    .min(3, "Must be 3 or more characters long")
    .max(400, "Must be 400 or fewer characters long"),
  location: z
    .string()
    .min(5, "Must be 5 or more characters long")
    .max(400, "Must be 50 or fewer characters long"),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});

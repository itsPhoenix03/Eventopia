"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/lib/database/model/category.model";
import { getAllCategories } from "@/lib/actions/category.action";

function CategoryFilter() {
  // Router
  const router = useRouter();

  // Fetching the search params
  const searchParams = useSearchParams();

  // Search query state
  const [categories, setCategories] = useState<ICategory[]>([]);

  // Fetching all the categories from the DB
  useEffect(() => {
    const getCategoriesList = () => {
      // Getting all the categories from the DB
      getAllCategories()
        .then((categoriesList) => setCategories(categoriesList))
        .catch((error) => console.error(error));
    };

    // Calling the above function
    getCategoriesList();
  }, []);

  // Handle Category Select
  const onSelectCategory = (category: string) => {
    let newUrl = "";

    if (category && category !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }

    // redirecting to that route
    router.push(newUrl, { scroll: false });
  };

  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">
          All Categories
        </SelectItem>
        {categories.map((category) => (
          <SelectItem
            key={category._id}
            value={category.name}
            className="select-item p-regular-14"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CategoryFilter;

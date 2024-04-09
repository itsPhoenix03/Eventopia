import { startTransition, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ICategory } from "@/lib/database/model/category.model";
import { Input } from "../ui/input";

type DropDownProps = {
  value?: string;
  onChangeHandler?: () => void;
};

function DropDown({ value, onChangeHandler }: DropDownProps) {
  // Creating a State to handle the categories from the DB
  // TODO: Complete the category functionality to fetch categories from the DB
  const [categories, setCategories] = useState<ICategory[]>([]);

  // State to manage the addition of new category value
  const [newCategory, setNewCategory] = useState("");

  // Function to add the new category
  const handleAddCategory = () => {
    // TODO: Complete the implementation of this function
  };

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>

      {/* Options for Selection */}
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category._id}
              value={category._id}
              className="select-item p-regular-14"
            >
              {category.name}
            </SelectItem>
          ))}

        {/* Pop-up to add categories */}
        <AlertDialog>
          {/* Trigger Button to open pop-up */}
          <AlertDialogTrigger className="p-medium-14 w-full flex rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            +&nbsp;Add new category
          </AlertDialogTrigger>

          {/* Pop-up Content */}
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Category Name"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
              >
                Add Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
}

export default DropDown;

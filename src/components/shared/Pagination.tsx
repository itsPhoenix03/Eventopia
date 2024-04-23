"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

function Pagination({ page, totalPages, urlParamName }: PaginationProps) {
  // Router
  const router = useRouter();

  // Search Params
  const searchParams = useSearchParams();

  // Handle Click
  const onClick = (btnType: "prev" | "next") => {
    // Based on button click navigate pages
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    // Construct the new url page param
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    // Push to next or previous page
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant={"outline"}
        className="w-28"
        onClick={() => onClick("prev")}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant={"outline"}
        className="w-28"
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;

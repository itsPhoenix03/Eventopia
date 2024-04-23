import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.action";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  // Fetching all from the query params
  const searchText = (searchParams?.query as string) || "";
  const page = Number(searchParams?.page) || 1;
  const category = (searchParams?.category as string) || "";

  // Fetching the events
  const events = await getAllEvents({
    query: searchText,
    category,
    limit: 6,
    page,
  });

  return (
    <>
      {/* Hero Banner Section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Event, Our Platform!
            </h1>

            <p className="p-regular-20 md:p-regular-24">
              Organize and Participate in different of 100+ events, from
              competitions to workshops to seminars
            </p>

            <Button asChild className="w-full sm:w-fit button" size={"lg"}>
              <Link href={"#events"}>Explore Now</Link>
            </Button>
          </div>

          <Image
            src={"/assets/images/hero.png"}
            alt="Hero Banner Image"
            width={1000}
            height={1000}
            className="max-h-[70vh] 2xl:max-h-[50vh] object-contain object-center"
          />
        </div>
      </section>

      {/* Events Listing Section */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">
          <span className="text-primary">Trusted by</span>
          <br />
          Hundred&apos;s of our University Student&apos;s
        </h2>

        <div className="w-full flex flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
          collectionType="All_Events"
          emptyTitle="No Events Found"
          emptyStateSubText="Check back later!"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
}

import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
  getEventById,
  getRelatedEventByCategory,
} from "@/lib/actions/event.action";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import Image from "next/image";

async function EventDetails({ params: { id } }: SearchParamProps) {
  const event = await getEventById(id);

  // Fetching the related events based on the category
  const relatedEvents = await getRelatedEventByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: 1,
    limit: 6,
  });

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          {/* Event Image */}
          <Image
            src={event.imageUrl}
            alt="Event Image Banner"
            width={1000}
            height={500}
            priority
            className="h-full min-h-[300px] object-cover object-center"
          />

          {/* Event Content */}
          <div className="flex flex-col gap-8 w-full p-5 md:p-10">
            <div className="flex flex-col gap-6">
              {/* Event Title */}
              <h2 className="h2-bold">{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {/* Events Price Tag and Category Tag */}
                <div className="flex gap-3">
                  {/* Price Tag */}
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? "FREE" : <>&#8377;{`${event.price}`}</>}
                  </p>
                  {/* Category Tag */}
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                {/* Organizer Name */}
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  Organized/Managed by&nbsp;
                  <br />
                  <span className="text-primary-500">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} />

            {/* Description and Other Info Section */}
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                {/* Calender Icon */}
                <Image
                  src={"/assets/icons/calendar.svg"}
                  alt="Calender Icon"
                  width={32}
                  height={32}
                />

                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  {/* Start Date Time */}
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly}&nbsp;-&nbsp;
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  {/* End Date Time */}
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly}&nbsp;-&nbsp;
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              {/* Event Location */}
              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src={"/assets/icons/location.svg"}
                  alt="Location Icon"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>

              {/* Description and URL Section */}
              <div className="flex flex-col gap-2">
                {/* Description */}
                <p className="p-bold-16 text-grey-500">
                  What&apos;s this event about:
                </p>
                <p className="p-medium-16 lg:p-regular-18">
                  {event.description}
                </p>
                <p className="p-medium-16 lg:p-regular-18 truncate underline text-primary-500">
                  {event.url}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events Based on the Category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>

        <Collection
          data={relatedEvents?.data}
          collectionType="All_Events"
          emptyTitle="No Events Found"
          emptyStateSubText="Check back later!"
          limit={6}
          page={1}
          totalPages={1}
        />
      </section>
    </>
  );
}

export default EventDetails;

import { IEvent } from "@/lib/database/model/event.model";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmation } from "./DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};
function Card({ event, hasOrderLink, hidePrice }: CardProps) {
  // Logic for finding which events are created by logged-in user
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // Check for logged-in user and organizer are same
  const isEventCreator = userId === event.organizer._id.toString();

  return (
    <div className="group relative flex min-h-[380px] md:min-h-[438px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
      {/* Card Image Display */}
      <Link
        href={`/events/${event._id}`}
        className="flex-center flex-grow text-grey-500"
      >
        <Image
          src={event.imageUrl}
          alt="Event Image Banner"
          fill={true}
          priority
          className="object-cover object-center z-0"
        />
      </Link>

      {/* Creator Actions */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src={"/assets/icons/edit.svg"}
              alt="Edit Icon"
              width={20}
              height={20}
            />
          </Link>

          {/* Delete Event */}
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      {/* Card Event Information */}
      <div className="flex min-h-[230px] flex-col gap-3 md:gap-4 p-5 z-10 bg-gray-50 rounded-xl">
        {/* Display Price only if event already not purchased */}
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full px-4 py-1 bg-green-100 text-green-700">
              {event.isFree ? "FREE" : <>&#8377;{`${event.price}`}</>}
            </span>
            <p className="p-semibold-14 w-min rounded-full px-4 py-1 bg-grey-500/10 text-grey-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
        )}

        {/* Event Start Date Time */}
        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        {/* Event Title */}
        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 text-black line-clamp-2 flex-1">
            {event.title}
          </p>
        </Link>

        {/* Organizer Name and If Event is purchased then showing order details link */}
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {event.organizer.firstName}&nbsp;{event.organizer.lastName}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image
                src={"/assets/icons/arrow.svg"}
                alt="Arrow Icon"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;

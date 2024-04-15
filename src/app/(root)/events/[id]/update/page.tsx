import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.action";
import { auth } from "@clerk/nextjs";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

async function UpdateEvent({ params: { id } }: UpdateEventProps) {
  // Fetching the session from the clerk
  const { sessionClaims } = auth();

  // Getting the userId from that session data
  const userId = sessionClaims?.userId as string;

  // Get the event details based on the event id
  const event = await getEventById(id);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-20">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          userId={userId}
          event={event}
          eventId={event._id}
          type="Update"
        />
      </div>
    </>
  );
}

export default UpdateEvent;

import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventByUser } from "@/lib/actions/event.action";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

async function ProfilePage() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // User Organized Events
  const organizedEvents = await getEventByUser({ userId, page: 1 });

  return (
    <>
      {/* My Tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href={"/#events"}>Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={[]}
          collectionType="My_Tickets"
          emptyTitle="No event tickets purchased yet!"
          emptyStateSubText="No worries - plenty of exciting events to explore!"
          limit={3}
          // urlParamName=""
          page={1}
          totalPages={1}
        />
      </section>

      {/* Organized Events */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            Event&apos;s Organized
          </h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href={"/events/create"}>Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          collectionType="Events_Organized"
          emptyTitle="No events have been created yet"
          emptyStateSubText="Go create some now"
          limit={6}
          page={1}
          totalPages={1}
        />
      </section>
    </>
  );
}

export default ProfilePage;

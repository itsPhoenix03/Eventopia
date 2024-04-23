import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventByUser } from "@/lib/actions/event.action";
import { getOrdersByUser } from "@/lib/actions/order.action";
import { IOrder } from "@/lib/database/model/order.model";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

async function ProfilePage({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // Retrieving the page number for pagination process
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  // User Purchased Events
  const orders = await getOrdersByUser({ userId, page: ordersPage });
  const purchasedEvents =
    orders?.data.map((order: IOrder) => order.event) || [];

  // User Organized Events
  const organizedEvents = await getEventByUser({ userId, page: eventsPage });

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
          data={purchasedEvents}
          collectionType="My_Tickets"
          emptyTitle="No event tickets purchased yet!"
          emptyStateSubText="No worries - plenty of exciting events to explore!"
          limit={3}
          urlParamName="ordersPage"
          page={ordersPage}
          totalPages={orders?.totalPages}
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
          emptyTitle="No events have been created yet!"
          emptyStateSubText="Go create some now!"
          limit={3}
          urlParamName="eventsPage"
          page={eventsPage}
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
}

export default ProfilePage;

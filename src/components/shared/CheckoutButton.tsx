"use client";

import { IEvent } from "@/lib/database/model/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";

function CheckoutButton({ event }: { event: IEvent }) {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;

  const isEventEnded = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {/* Check if the event has ended */}
      {isEventEnded ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available!
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild size="lg" className="button rounded-full">
              <Link href={"/sign-in"}>Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
}

export default CheckoutButton;

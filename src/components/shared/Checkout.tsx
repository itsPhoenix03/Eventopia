import { loadStripe } from "@stripe/stripe-js";

import { IEvent } from "@/lib/database/model/event.model";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { checkoutOrder } from "@/lib/actions/order.action";

// Loading the Stripe to create an "Stripe" object
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function Checkout({ event, userId }: { event: IEvent; userId: string }) {
  // For handling the success and cancel status of the payment
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  // Payment Checkout function
  const handleCheckout = async () => {
    const order = {
      eventId: event._id,
      eventTitle: event.title,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };
    // console.log(order);
    await checkoutOrder(order);
  };

  return (
    <form action={handleCheckout}>
      <Button type="submit" size="lg" className="button sm:w-fit">
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </form>
  );
}

export default Checkout;

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src={"/assets/images/logo.svg"}
            alt="Evently Logo"
            width={128}
            height={38}
          />
        </Link>

        {/* Desktop Nav */}
        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        <div className="w-32 flex justify-end gap-3">
          {/* If user is logged in this component gets displayed */}
          <SignedIn>
            {/* User Modal for user settings */}
            <UserButton afterSignOutUrl="/" />

            {/* Mobile Nav */}
            <MobileNav />
          </SignedIn>

          {/* If user is logged out this component gets displayed */}
          <SignedOut>
            <Button asChild className="rounded-full" size={"lg"}>
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default Header;

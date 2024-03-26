import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";

import NavItems from "./NavItems";

function MobileNav() {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src={"/assets/icons/menu.svg"}
            alt="Menu Logo"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          {/* Sheet Header */}
          <SheetHeader className="font-semibold text-primary text-md">
            Navigate 🔭
          </SheetHeader>

          <Separator className="border border-gray-100" />

          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export default MobileNav;

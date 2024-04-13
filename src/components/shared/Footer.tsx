import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t">
      <div className="flex flex-between flex-center gap-4 flex-col sm:flex-row wrapper p-5 text-center">
        <p className="text-xs text-gray-500">
          Evently &copy;&nbsp;{new Date().getFullYear() + 2}&nbsp;All rights
          reserved
        </p>

        <p className="text-xs text-gray-500">
          Develop with&nbsp;
          <span className="text-rose-500 text-lg">&#9825;</span>
          &nbsp;by&nbsp;
          <Link href={"#"} className="relative text-primary">
            Shreyas
            <Image
              src={"/assets/icons/arrow.svg"}
              alt="Link to LinkedIn"
              width={5}
              height={5}
              className="absolute top-[2px] -right-[6px]"
            />
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

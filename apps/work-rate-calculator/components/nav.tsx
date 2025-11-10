"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-4  border-b-2 border-gray-50">
      <div className="flex items-center space-x-2">
        <Image
          src="/flowerhead.png"
          alt="Work Rate Calculator Logo"
          width={80}
          height={80}
        />
        <h1 className="text-xl font-semibold">flowerHead.dev</h1>
      </div>
      <div>
        <Link href="scheduler">Scheduler</Link>
      </div>
      <div>
        <a
          href="mailto:flowerhead.dev@gmail.com?subject=I%20have%20a%20project%20I'd%20like%20help%20with"
          className=" hover:text-gray-400"
        >
          <Mail />
        </a>
      </div>
    </nav>
  );
};

export default Nav;

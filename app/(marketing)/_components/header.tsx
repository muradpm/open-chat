"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="flex items-center justify-between w-full sticky top-0 bg-background py-1.5 px-2 md:px-2 gap-2">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={25}
            height={25}
            className="dark:hidden"
            priority
          />
          <Image
            src="/logo-dark.svg"
            alt="Logo"
            width={25}
            height={25}
            className="hidden dark:block"
            priority
          />
        </Link>
        <span className="text-lg font-semibold">OpenChat</span>
      </div>
      <div className="hidden md:flex">
        <Button asChild>
          <Link href="/chat">Try it free</Link>
        </Button>
      </div>
    </header>
  );
};

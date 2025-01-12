import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="flex h-screen">
      <div className="hidden w-1/2 bg-muted/40 lg:block" />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[350px] space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
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
            <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
            <p className="text-sm text-muted-foreground">
              Create account to get started.
            </p>
          </div>
          <UserAuthForm />
          <p className="text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="hover:text-brand underline underline-offset-4">
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy
            </Link>
            .
          </p>
        </div>
      </div>
      <Link href="/chat">
        <Button variant="ghost" className="absolute right-4 top-4 md:right-2 md:top-2">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
    </div>
  );
}

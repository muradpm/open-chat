"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { LogoGoogle } from "@/components/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { signIn } = useAuthActions();

  return (
    <div className={className} {...props}>
      <Button
        variant="outline"
        onClick={() => void signIn("google", { redirectTo: "/chat" })}
        className="w-full"
      >
        <LogoGoogle />
        Sign up with Google
      </Button>
    </div>
  );
}

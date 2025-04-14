"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <img
          src={session?.user?.image || ""}
          alt={session?.user?.name || ""}
          className="w-8 h-8 rounded-full"
        />
        <span>{session.user?.name}</span>
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => signIn("google",{ callbackUrl: "/meeting" })}
      className="flex items-center gap-2"
    >
      Sign in with Google
    </Button>
  );
}

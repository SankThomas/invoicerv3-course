"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function NotFound() {
  const { user, isAuthenticated } = useKindeBrowserClient();

  return (
    <div className="mx-auto flex h-screen max-w-lg flex-col items-center justify-center space-y-6 px-4 text-center">
      <h1 className="text-4xl font-bold">404 Page Not Found</h1>
      <p>The page you were looking for could not be found</p>

      {user && isAuthenticated ? (
        <Button>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      ) : (
        <Button>
          <Link href="/">Back to homepage</Link>
        </Button>
      )}
    </div>
  );
}

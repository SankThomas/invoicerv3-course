"use client";

import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function LandingPage() {
  const { user, isAuthenticated } = useKindeBrowserClient();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-8 text-blue-600" />
            <span className="text-2xl font-bold">Invoicer</span>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="hidden lg:block">
              <Link href="/terms">Terms of use</Link>
            </Button>
            <Button asChild variant="ghost" className="hidden lg:block">
              <Link href="/privacy">Privacy policy</Link>
            </Button>
            {user && isAuthenticated ? (
              <Button variant="default">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <LoginLink>
                <Button variant="default">Sign In</Button>
              </LoginLink>
            )}
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
            Professional Invoicing <br /> Made Simple
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Create invoices, track payments, and manage your freelancing
            business with our web app.
          </p>

          <div className="flex items-center justify-center gap-4">
            {user && isAuthenticated ? (
              <Button variant="default">
                <Link href="/dashboard">View Your Dashboard</Link>
              </Button>
            ) : (
              <LoginLink>
                <Button size="lg" className="gap-2">
                  Get started for free <ChevronRight className="size-5" />
                </Button>
              </LoginLink>
            )}

            <Button asChild variant="outline" size="lg">
              <Link href="/terms">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

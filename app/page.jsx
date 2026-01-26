"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LandingPage from "@/components/landing-page";
import LoadingSpinner from "@/components/loading-spinner";

export default function Home() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) return <LandingPage />;

  return <LandingPage />;
}
